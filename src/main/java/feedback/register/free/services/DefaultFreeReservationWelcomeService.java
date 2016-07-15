package feedback.register.free.services;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.topspectrum.mail.AuditedEmailService;
import com.topspectrum.mail.EmailTemplate;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.slack.SlackService;
import com.topspectrum.template.EmailTemplateService;
import com.topspectrum.template.Parameters;
import com.topspectrum.template.TemplateUtil;
import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.util.MorePreconditions;
import com.topspectrum.util.StringUtils;
import com.topspectrum.web.util.UrlFactory;
import com.topspectrum.whois.WhoisRecordBuilder;
import com.topspectrum.whois.WhoisRecordRepository;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationRepository;
import feedback.services.VerificationService;
import feedback.web.controllers.exceptions.RestExceptions;
import feedback.web.data.JpaContextHelper;
import feedback.web.data.PendingVerificationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * @author msmyers
 * @since 6/22/16
 */
@Service
public class DefaultFreeReservationWelcomeService implements FreeReservationWelcomeService, InitializingBean {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultFreeReservationWelcomeService.class);

    //region Injected properties - applicationContext.xml
    @Autowired
    Environment environment;

    @Autowired
    UrlFactory urlFactory;

    @Autowired
    VerificationService verificationService;

    @Autowired
    WhoisRecordRepository whoisRecordRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    JpaContextHelper contextHelper;

    @Autowired
    ApprovalService approvalService;

    @Autowired
    AuditedEmailService auditedEmailService;

    @Autowired
    EmailTemplateService emailTemplateService;

    @Autowired
    SlackService slackService;

    @Autowired
    TemplatedEmailService templatedEmailService;
    //endregion

    //region properties - Injected via application-{env}.properties
    @Value("${feedback.free.customerEmail}")
    String customerEmailOverride;

    @Value("${feedback.free.internalCompanyEmail}")
    String internalCompanyEmail;

    @Value("${feedback.free.url}")
    String baseUrl;
    //endregion

    EmailTemplate suggestedReservationEmailTemplate;

    @Override
    public void afterPropertiesSet() throws Exception {
        suggestedReservationEmailTemplate = emailTemplateService.getTemplateByName("email.customer.suggestion");

        RestExceptions.checkServerError(baseUrl, StringUtils::isNotBlank);
    }

    @Override
    public void send(@NotNull final FreeReservation reservation) throws Exception {
        final Map<String, Object> parameters = Maps.newHashMapWithExpectedSize(10);

        final WhoisIdentity identity = Preconditions.checkNotNull(reservation.toWhoisIdentity(WhoisRecordBuilder.CommonAgent.Registrant), "identity");
        final String email = Preconditions.checkNotNull(identity.getEmail(), "email");
        final String url = buildUrl(reservation);

        {
            parameters.put("url", url);
            parameters.put("identity", identity);
            parameters.put("reservation", reservation);
        }

        templatedEmailService.send(email, null, "email.customer.suggestion", parameters);
    }

    protected void shouldBeReadyForSuggestion(@NotNull final FreeReservation reservation) {
        Preconditions.checkNotNull(reservation);
        Preconditions.checkState(!reservation.isNew());

        Preconditions.checkState(reservation.isSuggested());
        Preconditions.checkState(!reservation.isDeleted());
        Preconditions.checkState(!reservation.isPendingPolicyApproval());

        Preconditions.checkNotNull(reservation.getDestinationWhoisRecord());
        Preconditions.checkState(DomainNameUtils.isOurTopLevelDomainName(reservation.getDestinationWhoisRecord().getFullDomainName()), "The fullDomainName must be ours: " + reservation.getDestinationWhoisRecord().getFullDomainName());
        Preconditions.checkState(DomainNameUtils.isOurTopLevelDomainName(reservation.getDestinationFullDomainName()));
        Preconditions.checkState(StringUtils.equals(reservation.getDestinationWhoisRecord().getFullDomainName(), reservation.getDestinationFullDomainName()));

        reservation.shouldBeApproved();
        reservation.shouldNotBePurchased();

        Preconditions.checkState(null != reservation.getApprovalDate(), "Must be approved before calling this.");
    }

    @Override
    public void sendCustomerSuggestionEmail(@NotNull final FreeReservation reservation) throws Exception {
        shouldBeReadyForSuggestion(reservation);

        final EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.suggestion");

        final Parameters params = parameters();
        final UriComponentsBuilder actionUrl = approvalService.approvalUrlBuilder(reservation);
        final String customerEmail = getCustomerEmail(reservation);

        {
            params.put("reservation", reservation);
            params.put("identity", reservation.toWhoisIdentity());
            params.put("approveUrl", actionUrl.buildAndExpand(true));
            params.put("denyUrl", actionUrl.buildAndExpand(false));
            params.put("claimUrl", getUrlForSuggestion(reservation));
        }

        templatedEmailService.send(customerEmail, template, params);
    }

    @Override
    public void sendOperationsSuggestionSlackEvent(@NotNull final FreeReservation reservation) throws Exception {
        Preconditions.checkState(reservation.isSuggested(), "This method can only be called if the reservation is suggested");

        slackService.builder()
                .username("free.feedback")
                .text(TemplateUtil.inlineStringTemplate("We suggested $reservation.destinationWhoisRecord.fullDomainName$ to $reservation.email$!", new Parameters()
                        .put("reservation", reservation)))
                .execute();
    }

//    public void sendCompanyConfirmationEmail(@NotNull final FreeReservation reservation) throws Exception {
//        EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.confirmation");
//
//        final Parameters params = parameters();
//        final UriComponentsBuilder actionUrl = approvalService.approvalUrlBuilder(reservation);
//
//        {
//            params.put("reservation", reservation);
//            params.put("approveUrl", actionUrl.buildAndExpand(true));
//            params.put("denyUrl", actionUrl.buildAndExpand(false));
//        }
//
//        Preconditions.checkState(StringUtils.isValidEmail(internalCompanyEmail), "must be valid email: " + internalCompanyEmail);
//
//        templatedEmailService.send(internalCompanyEmail, template, params);
//
//        if (reservation.isPendingPolicyApproval()) {
//            approvalService.requestApproval(reservation);
//        }
//    }

    /**
     * Should be called when "Agree To Terms" is submitted.
     *
     * @param reservation
     * @throws Exception
     */
    @Override
    public void sendCustomerConfirmationEmail(@NotNull final FreeReservation reservation) throws Exception {
//        final Parameters parameters = parameters(reservation);
//
//        if (reservation.isSuggested()) {
//            {
//                parameters.put("url", "http://" + baseUrl + "/manage?reservation=" + reservation.getPendingVerificationToken().getToken());
//            }
//
//            templatedEmailService.send(
//                    getCustomerEmail(reservation),
//                    suggestedReservationEmailTemplate,
//                    parameters);
//        } else if (reservation.isPendingPolicyApproval()) {
//            approvalService.requestApproval(reservation);
//        } else  {
//
//        }
//
//        final EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.confirmation");
//        final String url = getUrlForSuggestion(reservation);
//        final Parameters params = parameters();
//
//        {
//            params.put("identity", reservation.toWhoisIdentity());
//            params.put("reservation", reservation);
//            params.put("url", url);
//        }
//
//        String customerEmail = getCustomerEmail(reservation);
//
//        templatedEmailService.send(customerEmail, template, params);
    }

    @Override
    public void sendOperationsConfirmationEmail(@NotNull FreeReservation reservation) throws Exception {

    }

    @Override
    public void sendOperationsSuggestionEmail(@NotNull FreeReservation reservation) throws Exception {
        shouldBeReadyForSuggestion(reservation);

        final EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.suggestion");

        final Parameters params = parameters();
        final UriComponentsBuilder actionUrl = approvalService.approvalUrlBuilder(reservation);
        final String customerEmail = getCustomerEmail(reservation);

        {
            params.put("reservation", reservation);
            params.put("identity", reservation.toWhoisIdentity());
            params.put("approveUrl", actionUrl.buildAndExpand(true));
            params.put("denyUrl", actionUrl.buildAndExpand(false));
            params.put("claimUrl", getUrlForSuggestion(reservation));
        }

        templatedEmailService.send(internalCompanyEmail, template, params);
    }

    @Override
    public void sendCustomerApprovalEmail(@NotNull FreeReservation reservation) throws Exception {

    }

    @Override
    public void sendOperationsApprovalSlackEvent(@NotNull FreeReservation reservation) throws Exception {

    }

    @Override
    public void sendOperationsApprovalEmail(@NotNull FreeReservation reservation) throws Exception {

    }

    @VisibleForTesting
    protected Parameters parameters() {
        Parameters parameters = new Parameters();

        parameters.put("baseUrl", baseUrl);
        parameters.put("topLevelDomainName", "feedback");

        return parameters;
    }

    @VisibleForTesting
    protected Parameters parameters(@NotNull final FreeReservation reservation) {
        return parameters()
                .put("reservation", reservation)
                .put("identity", reservation.toWhoisIdentity());
    }

    @VisibleForTesting
    protected String buildUrl(@NotNull final FreeReservation reservation) {
        PendingVerificationToken token = reservation.getPendingVerificationToken();

        return UriComponentsBuilder.fromHttpUrl("http://" + baseUrl + "/api/v1/claim")
                .queryParam("reservation", token.getToken())
                .toUriString();
    }

    @NotNull
    public String getCustomerEmail(@NotNull final FreeReservation reservation) {
        return MorePreconditions.checkNotBlank(StringUtils.defaultIfBlank(customerEmailOverride, reservation.getEmail()));
    }

    @NotNull
    public String getUrlForSuggestion(@NotNull FreeReservation reservation) {
        String email = reservation.getEmail();
        PendingVerificationToken token = verificationService.generate("free.feedback/suggestion", email);

        reservation.setPendingVerificationToken(token);

        freeReservationRepository.save(reservation);

        return urlFactory
                .toBuilder("/api/v1/claim")
                .queryParam("token", token.getToken())
                .toUriString();
    }

    //region getter/setter
    public TemplatedEmailService getTemplatedEmailService() {
        return templatedEmailService;
    }

    public void setTemplatedEmailService(TemplatedEmailService templatedEmailService) {
        this.templatedEmailService = templatedEmailService;
    }
    //endregion
}
