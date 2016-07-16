package feedback.register.free.services;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Preconditions;
import com.topspectrum.data.PageUtils;
import com.topspectrum.mail.EmailAuditService;
import com.topspectrum.mail.EmailReceipt;
import com.topspectrum.mail.EmailTemplate;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.slack.SlackNotificationBuilder;
import com.topspectrum.slack.SlackService;
import com.topspectrum.template.EmailTemplateService;
import com.topspectrum.template.HandlebarsUtil;
import com.topspectrum.template.Parameters;
import com.topspectrum.template.TemplateUtil;
import com.topspectrum.util.MorePreconditions;
import com.topspectrum.util.StringUtils;
import com.topspectrum.web.util.UrlFactory;
import com.topspectrum.whois.WhoisRecordRepository;
import com.zipwhip.concurrent.ObservableFuture;
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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/22/16
 */
@Service
@Transactional(propagation = Propagation.MANDATORY, transactionManager = "freeTransactionManager")
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
    EmailAuditService emailAuditService;

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
        shouldBeReadyForTheBasics(reservation);

        if (reservation.isSuggested()) {
            try {
                sendCustomerSuggestionEmail(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }

            try {
                sendOperationsSuggestionEmail(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }

            try {
                sendOperationsSuggestionSlackEvent(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }



        } else if (reservation.isPendingPolicyApproval()) {
            // We need to send out a pending email
            try {
                sendCustomerApprovalEmail(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }

            try {
                sendOperationsApprovalSlackEvent(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed ot send", e);
            }

            try {
                sendOperationsApprovalEmail(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }



        } else if (reservation.isPurchased()) {
            try {
                sendCustomerConfirmationEmail(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }

            try {
                sendOperationsConfirmationEmail(reservation);
            } catch (Exception e) {
                LOGGER.error("Failed to send", e);
            }
        } else {
            throw new IllegalArgumentException("Not sure what to do with: " + reservation);
        }
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

    //region confirmation
    /**
     * Should be called when "Agree To Terms" is submitted.
     *
     * @param reservation
     * @throws Exception
     */
    @Override
    public void sendCustomerConfirmationEmail(@NotNull final FreeReservation reservation) throws Exception {
        shouldBeReadyForConfirmation(reservation);

        final String customerEmail = getCustomerEmail(reservation);
        final EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.confirmation");
        final String url = getUrlForSuggestion(reservation);
        final Parameters params = parameters(reservation);

        {
            params.put("identity", reservation.toWhoisIdentity());
            params.put("reservation", reservation);
            params.put("url", url);
        }


        auditedSendEmail(customerEmail, template, params);
    }

    @Override
    public void sendOperationsConfirmationEmail(@NotNull FreeReservation reservation) throws Exception {
        shouldBeReadyForConfirmation(reservation);

        final String email = getOperationsEmail(reservation);
        final EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.confirmation");
        final String url = getUrlForSuggestion(reservation);
        final Parameters params = parameters(reservation);

        {
            params.put("identity", reservation.toWhoisIdentity());
            params.put("reservation", reservation);
            params.put("url", url);
        }

        auditedSendEmail(email, template, params);
    }
    //endregion

    //region suggestion
    @Override
    public void sendOperationsSuggestionEmail(@NotNull FreeReservation reservation) throws Exception {
        shouldBeReadyForSuggestion(reservation);

        final EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.suggestion");
        final Parameters params = parameters(reservation);

        {
            withClaim(params, reservation);
        }

        auditedSendEmail(internalCompanyEmail, template, params);
    }

    @Override
    public void sendCustomerSuggestionEmail(@NotNull final FreeReservation reservation) throws Exception {
        shouldBeReadyForSuggestion(reservation);

        final EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.suggestion");
        final Parameters params = parameters();
        final String customerEmail = getCustomerEmail(reservation);

        {
            withReservation(params, reservation);
            withApproval(params, reservation);
            withClaim(params, reservation);
        }

        auditedSendEmail(customerEmail, template, params);
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
    //endregion

    //region approval
    @Override
    public void sendCustomerApprovalEmail(@NotNull final FreeReservation reservation) throws Exception {
        shouldBeReadyForApproval(reservation);

        final EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.approval");
        final Parameters params = parameters();
        final String customerEmail = getCustomerEmail(reservation);

        {
            withReservation(params, reservation);
            withApproval(params, reservation);
            withClaim(params, reservation);
        }

        auditedSendEmail(customerEmail, template, params);
    }

    @Override
    public void sendOperationsApprovalEmail(@NotNull final FreeReservation reservation) throws Exception {
        final EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.approval");
        final String email = getOperationsEmail(reservation);

        auditedSendEmail(email, template, withApproval(parameters(reservation), reservation));

//        return new FakeObservableFuture<>(this, null);
    }

    @Override
    public void sendOperationsApprovalSlackEvent(@NotNull final FreeReservation reservation) throws Exception {
        SlackNotificationBuilder builder = slackService.builder();

        UriComponentsBuilder actionUrl = getUrlForApproval(reservation);

        ObservableFuture<Void> future = builder
                .username("free.feedback")
                .channel("events")
                .text(
                        HandlebarsUtil.inline("{{customerName}} ({{reservation.email}}) needs approval to register <http://www.{{fullDomainName}}|{{fullDomainName}}>\n" +
                                        "\n" +
                                        "This email has {{numberOfPendingReservations}} pending reservations and {{numberOfActiveReservations}} approved reservations.\n" +
                                        "\n" +
                                        "<{{approveUrl}}|Approve>\n" +
                                        "<{{denyUrl}}|Deny>",
                                new Parameters()
                                        .put("reservation", reservation)
                                        .put("numberOfPendingReservations", numberOfPendingReservations(reservation))
                                        .put("numberOfActiveReservations", numberOfActiveReservations(reservation))
                                        .put("customerName", reservation.getDestinationWhoisRecord().getRegistrantName())
                                        .put("fullDomainName", reservation.getDestinationFullDomainName())
                                        .put("approveUrl", actionUrl
                                                .buildAndExpand(Parameters.single("approved", true))
                                                .toUriString())
                                        .put("denyUrl", actionUrl
                                                .buildAndExpand(Parameters.single("approved", true))
                                                .toUriString())
                        ))
                .execute();

//        return FutureUtils.wrapFailureObserver(future, LOGGER);
    }

    //endregion

    @NotNull
    protected String getCustomerEmail(@NotNull final FreeReservation reservation) {
        return MorePreconditions.checkNotBlank(StringUtils.defaultIfBlank(customerEmailOverride, reservation.getEmail()));
    }

    @NotNull
    protected String getUrlForSuggestion(@NotNull FreeReservation reservation) {
        String email = reservation.getEmail();
        PendingVerificationToken token = verificationService.generate("free.feedback/suggestion", email);

        reservation.setPendingVerificationToken(token);

        freeReservationRepository.save(reservation);

        return urlFactory.toBuilder("/protected-registrations/review")
                .queryParam("website", reservation.getDestinationFullDomainName())
                .queryParam("approvedBy", "lauren" + token.getCode())
                .toUriString();
    }

    @NotNull
    protected UriComponentsBuilder getUrlForApproval(@NotNull FreeReservation reservation) throws Exception {
        return urlFactory
                .toBuilder("/api/v1/approval")
                .queryParam("approved", "{approved}")
                .queryParam("token", approvalService.generateToken(reservation));
    }

    protected long numberOfPendingReservations(@NotNull final FreeReservation reservation) {
        return freeReservationRepository.findByEmailAndPurchaseDateIsNullAndDeletedIsFalseAndPendingPolicyApprovalIsTrue(reservation.getEmail(), PageUtils.defaultPageable()).getTotalElements();
    }

    protected long numberOfActiveReservations(@NotNull final FreeReservation reservation) {
        return freeReservationRepository.findByEmailAndPurchaseDateIsNotNullAndDeletedIsFalse(reservation.getEmail(), PageUtils.defaultPageable()).getTotalElements();
    }

    @NotNull
    protected Parameters withReservation(Parameters params, FreeReservation reservation) {
        params.put("reservation", reservation);
        params.put("identity", reservation.toWhoisIdentity());

        return params;
    }

    @NotNull
    protected Parameters withApproval(@NotNull final Parameters params, @NotNull FreeReservation reservation) throws Exception {
        final UriComponentsBuilder actionUrl = getUrlForApproval(reservation);

        params.put("approveUrl", actionUrl.buildAndExpand(true));
        params.put("denyUrl", actionUrl.buildAndExpand(false));

        return params;
    }

    @NotNull
    protected Parameters withClaim(@NotNull final Parameters params, @NotNull FreeReservation reservation) {

        params.put("claimUrl", getUrlForSuggestion(reservation));

        return params;
    }

    @NotNull
    protected FreeReservation shouldBeReadyForTheBasics(@NotNull final FreeReservation reservation) {
        return Preconditions.checkNotNull(reservation)
                .shouldBeReady();
    }

    @NotNull
    protected FreeReservation shouldBeReadyForConfirmation(@NotNull final FreeReservation reservation) {
        return shouldBeReadyForTheBasics(reservation)
                .shouldBeCheckout()
                .shouldBeApproved()
                .shouldBePurchased();
    }

    @NotNull
    protected FreeReservation shouldBeReadyForSuggestion(@NotNull final FreeReservation reservation) {
        return shouldBeReadyForTheBasics(reservation)
            .shouldBeApproved()
            .shouldNotBePurchased();
    }

    @NotNull
    protected FreeReservation shouldBeReadyForApproval(@NotNull final FreeReservation reservation) {
        return shouldBeReadyForTheBasics(reservation)
                .shouldBePendingApproval()
                .shouldNotBePurchased();
    }

    @NotNull
    protected String getOperationsEmail(@NotNull final FreeReservation reservation) {
        return getOperationsEmail();
    }

    @NotNull
    protected String getOperationsEmail() {
        return internalCompanyEmail;
    }

    protected void auditedSendEmail(@NotNull final String customerEmail, @NotNull final EmailTemplate template, @NotNull final Parameters params) throws Exception {
        EmailReceipt receipt = templatedEmailService.send(customerEmail, template, params);

        emailAuditService.record(receipt, "");
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
        return withReservation(parameters(), reservation);
//        return parameters()
//                .put("reservation", reservation)
//                .put("identity", reservation.toWhoisIdentity());
    }

//    @VisibleForTesting
//    protected String buildUrl(@NotNull final FreeReservation reservation) {
//        PendingVerificationToken token = reservation.getPendingVerificationToken();
//
//        return UriComponentsBuilder.fromHttpUrl("http://" + baseUrl + "/api/v1/claim")
//                .queryParam("reservation", token.getToken())
//                .toUriString();
//    }

    //region getter/setter
    public TemplatedEmailService getTemplatedEmailService() {
        return templatedEmailService;
    }

    public void setTemplatedEmailService(TemplatedEmailService templatedEmailService) {
        this.templatedEmailService = templatedEmailService;
    }
    //endregion

}
