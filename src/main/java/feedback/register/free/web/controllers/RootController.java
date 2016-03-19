package feedback.register.free.web.controllers;

import com.google.common.base.Preconditions;
import com.topspectrum.data.PageUtils;
import com.topspectrum.mail.EmailTemplate;
import com.topspectrum.mail.TemplatedMailService;
import com.topspectrum.services.GoogleDocService;
import com.topspectrum.template.EmailTemplateService;
import com.topspectrum.template.Parameters;
import com.topspectrum.template.STStringTemplate;
import com.topspectrum.template.Template;
import com.topspectrum.util.ConversionUtils;
import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.util.MorePreconditions;
import com.topspectrum.util.StringUtils;
import feedback.register.free.data.*;
import feedback.register.free.web.model.FreeReservationToken;
import feedback.register.free.web.model.FreeReservationTokenWrapper;
import feedback.register.free.whois.WhoisConnection;
import feedback.register.free.whois.WhoisRecordBuilder;
import feedback.services.VerificationService;
import feedback.web.controllers.exceptions.RestExceptions;
import feedback.web.data.JpaContextHelper;
import feedback.web.data.PendingVerificationToken;
import feedback.web.security.SecurityUtil;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Nullable;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 9/7/15
 */
@Controller
public class RootController {

    private static final Logger LOGGER = LoggerFactory.getLogger(RootController.class);

    @Autowired
    Environment environment;

    @Autowired
    VerificationService verificationService;

    @Autowired
    GoogleDocService googleDocService;

    @Autowired
    WhoisRecordRepository whoisRecordRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    WhoisConnection whoisConnection;

    @Autowired
    TemplatedMailService templatedMailService;

    @Autowired
    JpaContextHelper contextHelper;

    // Should reference a property.
    @Value("${feedback.free.url}")
    String baseUrl;

    // Should reference a property.
    @Value("${feedback.free.customerEmail}")
    String customerEmailOverride;

    @Value("${feedback.free.internalCompanyEmail}")
    String internalCompanyEmail;

    @Autowired
    EmailTemplateService emailTemplateService;

    @Autowired
    ReferralCodeRepository referralCodeRepository;

//    @RequestMapping(value = "/", method = RequestMethod.GET)
//    public ModelAndView load_ember() throws ExecutionException, InterruptedException, IOException {
//        return new ModelAndView("index");
//    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    @ResponseBody
    public String load_api() throws ExecutionException, InterruptedException, IOException, MessagingException {
        return "api/v1";
    }

    @RequestMapping("/checkout_terms")
    @ResponseBody
    public String load_terms() throws InterruptedException, ExecutionException, IOException {
        // TODO: cache this.
        return googleDocService.getByDocumentId("1uvUkiVj0nnsONfHaT98uIljQ7CGKTuWBmOrM2pwVBzM");
    }

    @Transactional
    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
    @ResponseBody
    public Object checkout(HttpServletRequest request) throws MessagingException, IOException {
        FreeReservation reservation = getSavedReservation(request);

        // TOOD: validate the reservation.
        // TODO: allow for modification of the WHOIS information

        reservation.setPendingPolicyApproval(hasExistingReservationsForThisEmail(reservation.getEmail()));
        reservation.setCheckoutDate(DateTime.now());

        freeReservationRepository.save(reservation);

        // Nuke it so no replays.
        request.getSession().invalidate();

        /***
         * Send ops email if customer is reserving more than one.
         */

        sendCompanyConfirmationEmail(reservation);

        /***
         * Send customer confiramtion email with status
         */
        sendCustomerConfirmationEmail(reservation);

        return null;
    }

    @RequestMapping("/referralCodes")
    @ResponseBody
    public Map<String, Object> list_referral_codes() {

        Map<String, Object> result = new HashMap<>();

        {
            result.put("referral-code", referralCodeRepository.findAllByExpirationDateAfterOrExpirationDateIsNull(DateTime.now()));

        }

        return result;
    }

    @RequestMapping(value = "/reservations", method = RequestMethod.GET)
    @ResponseBody
    public FreeReservationTokenWrapper get_sessioned_reservation(HttpServletRequest request) {
        FreeReservation reservation = (FreeReservation) request.getSession().getAttribute("DATA");

        if (null == reservation) {
            RestExceptions.notFound();
        }

        return new FreeReservationTokenWrapper(new FreeReservationToken(reservation));
    }

    /***
     * Triggered when a customer has decided to buy.
     * <p>
     * - Save WHOIS record with the customer information
     * - Save the reservation
     * - Send email challenge (url with confirmation/token)
     *
     * @param request
     * @param wrapper
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     * @throws IOException
     * @throws MessagingException
     */
    @RequestMapping(value = "/reservations", method = RequestMethod.POST)
    @ResponseBody
    public FreeReservationTokenWrapper submit_request(
            HttpServletRequest request,
            @RequestBody FreeReservationTokenWrapper wrapper
    ) throws ExecutionException, InterruptedException, IOException, MessagingException {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("params: " + request.getParameterMap());
        }

        // Step 1, gather the info.
        // This will throw a BadRequest exception if it's not fully valid.
        final FreeReservation reservation = parseAndSaveReservationOrFail(wrapper);

        sendCustomerVerificationEmail(reservation);

        // This will start everything over from scratch
        request.getSession().invalidate();

        // The customer wants to know the ID? Not exactly sure how valuable it is to tell the customer this info.
        // My understanding is that they can close the window after making this call, since we are sending an email.
        wrapper.getReservation().setId(reservation.getId());

        return wrapper;
    }

    public void sendCustomerVerificationEmail(FreeReservation reservation) throws MessagingException, IOException {
        EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.confirm-identity");

        Parameters parameters = parameters(reservation);

        RestExceptions.checkServerError(baseUrl, StringUtils::isNotBlank);

        {
            parameters.put("url", "http://" + baseUrl + "/api/v1/verify_email?token=" + reservation.getPendingVerificationToken().getToken());
        }

        templatedMailService.send(getCustomerEmail(reservation), template, parameters);
    }

    /**
     * This is accessed via the browser when they click the link.
     *
     * @param request
     * @param token
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/verify_email", method = RequestMethod.GET)
    public ModelAndView verify_email__verify_token(
            HttpServletRequest request,
            @RequestParam(value = "token", required = false) String token
    ) throws Exception {
        final PendingVerificationToken pendingVerificationToken = verificationService.getByToken("free.feedback", token);

        if (null == pendingVerificationToken) {
            return new ModelAndView("redirect:/failed");
        } else {
            FreeReservation reservation = freeReservationRepository.findByPendingVerificationToken(pendingVerificationToken);

            if (null == reservation) {
                return new ModelAndView("redirect:/failed");
            }

            if (null == reservation.getVerifiedDate()) {
                reservation.setVerifiedDate(DateTime.now());

                freeReservationRepository.save(reservation);
            }

            // We need to pull up their thingy.
            request.getSession().setAttribute("DATA", reservation);

            return new ModelAndView("redirect:/checkout");
        }
    }

    @RequestMapping(value = "/availabilities/{fullDomainName:.+}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> query_available(
            HttpServletRequest request,
            @PathVariable("fullDomainName") String fullDomainName
    ) throws Exception {
        RestExceptions.checkBadRequest(fullDomainName, DomainNameUtils::isValidDotFeedbackFullDomainName);

//        Thread.sleep(3000);

        Map<String, Object> result = new HashMap<>();

        {
            Map<String, Object> availability = new HashMap<>();

            {
                availability.put("id", fullDomainName);
                availability.put("status", this.availability(fullDomainName));
            }

            result.put("availability", availability);
        }

        return result;
    }

    @RequestMapping(value = "/whois/{sourceFullDomainName:.+}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> search_whois(
            @PathVariable("sourceFullDomainName") String sourceFullDomainName
    ) throws Exception {
        RestExceptions.checkBadRequest(sourceFullDomainName);

        WhoisRecord whoisRecord = findAndSaveMostRecentWhoisRecord(sourceFullDomainName);

        Map<String, Object> result = new HashMap<>();

        {
            Map<String, Object> whois = new HashMap<>();

            {
                whois.put("fullDomainName", sourceFullDomainName);
                whois.put("id", sourceFullDomainName); // Same ID for Ember every time.

                if (null != whoisRecord) {
                    whois.put("name", whoisRecord.getRegistrantName());
                    whois.put("email", whoisRecord.getRegistrantEmail());
                    whois.put("street", whoisRecord.getRegistrantStreet());
                    whois.put("city", whoisRecord.getRegistrantCity());
                    whois.put("state", whoisRecord.getRegistrantState());
                    whois.put("postal", whoisRecord.getRegistrantPostal());
                    whois.put("country", whoisRecord.getRegistrantCountry());
                    whois.put("phone", whoisRecord.getRegistrantPhone());
                    whois.put("organization", whoisRecord.getRegistrantOrganization());
                    whois.put("phoneExt", whoisRecord.getRegistrantPhoneExt());
                }
            }

            result.put("whois", whois);
        }

        return result;
    }

    public void sendCompanyConfirmationEmail(FreeReservation reservation) throws MessagingException, IOException {
        EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.confirmation");

        final Parameters params = parameters();

        {
            params.put("reservation", reservation);
        }

        templatedMailService.send(getCustomerEmail(reservation), template, params);
    }

    public void sendCustomerConfirmationEmail(FreeReservation reservation) throws MessagingException, IOException {
        EmailTemplate template = emailTemplateService.getTemplateByName("email.customer.confirmation");

        final Parameters params = parameters();

        {
            params.put("reservation", reservation);
        }

        templatedMailService.send(getCustomerEmail(reservation), template, params);
    }

    @NotNull
    public String getCustomerEmail(@NotNull final FreeReservation reservation) {
        return MorePreconditions.checkNotBlank(StringUtils.defaultIfBlank(customerEmailOverride, reservation.getEmail()));
    }

    public Parameters parameters() {
        Parameters parameters = new Parameters();

        parameters.put("baseUrl", baseUrl);
        parameters.put("topLevelDomainName", "feedback");

        return parameters;
    }

    public void sendPendingPolicyApprovalEmail(FreeReservation reservation) throws MessagingException {
        Template template = new STStringTemplate("$email$ is trying to reserve $fullDomainName$ and requires approval. Please click $approvalUrl$");
        EmailTemplate requiresPolicyApprovalEmailTemplate = new EmailTemplate(new STStringTemplate("$email$ - requires approval for $fullDomainName$"), template, template);

        // We need to email ops.
        Map<String, Object> parameters = new HashMap<>();

        {
            parameters.put("fullDomainName", reservation.getDestinationFullDomainName());
            parameters.put("email", reservation.getEmail());
            parameters.put("approvalUrl", "http://" + baseUrl + "/api/v1/approvals?" + reservation.getEmail());
        }

        templatedMailService.send(internalCompanyEmail, requiresPolicyApprovalEmailTemplate, parameters);
    }

    public boolean hasExistingReservationsForThisEmail(@NotNull final String email) {
        RestExceptions.checkBadRequest(email, StringUtils::isNotBlank);

        return PageUtils.isNotEmpty(freeReservationRepository.findByEmailAndCheckoutDateIsNullAndDeletedIsFalse(email, PageUtils.singleResult()));
    }

    @NotNull
    public FreeReservation parseAndSaveReservationOrFail(@NotNull final FreeReservationTokenWrapper wrapper) {
        final FreeReservationToken token = wrapper.getReservation();
        final WhoisRecord record = parseWhoisRecordOrFail(token);

        final FreeReservation reservation = new FreeReservation();

        {
            reservation.setDestinationFullDomainName(token.getDestinationFullDomainName());
            reservation.setSourceFullDomainName(token.getSourceFullDomainName());

            reservation.setEmail(token.getEmail());

            reservation.setRemoteHost(SecurityUtil.currentRemoteHost());
            reservation.setFingerprint(SecurityUtil.currentFingerprint());

            reservation.setDestinationWhoisRecord(record);

            reservation.setPendingVerificationToken(verificationService.generate("free.feedback", token.getEmail()));
        }

        // Save the customer WHOIS.
        whoisRecordRepository.save(reservation.getDestinationWhoisRecord());

        // The return value will have the ID set.
        return freeReservationRepository.save(reservation);
    }

    public FreeReservation getSavedReservation(HttpServletRequest request) {
        Preconditions.checkNotNull(request);
        HttpSession session = RestExceptions.checkBadRequest(request.getSession());
        Object data = RestExceptions.checkBadRequest(session.getAttribute("DATA"));
        FreeReservation reservation = RestExceptions.checkBadRequest(ConversionUtils.cast(data, FreeReservation.class));

        return RestExceptions.checkNotFound(contextHelper.get(RestExceptions.checkNotFound(reservation)));
    }

    public WhoisRecord parseWhoisRecordOrFail(FreeReservationToken token) {
        return new WhoisRecordBuilder()
                .name(token.getName())
                .address(token.getStreet(), token.getCity(), token.getState(), token.getPostal(), token.getCountry())
                .email(token.getEmail())
                .fullDomainName(token.getDestinationFullDomainName())
                .phone(token.getPhone(), token.getPhoneExt())
                .fax(token.getFax(), token.getFaxExt())
                .registrar(token.getRegistrar())
                .build();
    }

    @NotNull
    public String availability(@NotNull final String dotfeedbackFullDomainName) throws Exception {
        RestExceptions.checkBadRequest(dotfeedbackFullDomainName, DomainNameUtils::isValidDotFeedbackFullDomainName);

        WhoisRecord record = findAndSaveMostRecentWhoisRecord(dotfeedbackFullDomainName);

        if (record.isNotFound()) {
            return "available";
        } else if (record.isFailed()) {
            return "unknown";
        } else if (record.isReserved()) {
            return "reserved";
        }

        return "unavailable";
//        return "available";
    }

    @NotNull
    public WhoisRecord findAndSaveMostRecentWhoisRecord(@NotNull final String fullDomainName) throws Exception {
        WhoisRecord record = findMostRecentWhoisRecord(fullDomainName);

        if (null == record) {
            record = whoisConnection.queryForRecord(fullDomainName);

            whoisRecordRepository.save(record);
        }

        return record;
    }

    @Nullable
    public WhoisRecord findMostRecentWhoisRecord(@NotNull final String fullDomainName) {
        DateTime createdDate = DateTime.now().minusDays(30);

        return PageUtils.first(whoisRecordRepository.findByFullDomainNameAndCreatedDateAfter(fullDomainName, createdDate, PageUtils.newest()));
    }

    protected Parameters parameters(FreeReservation reservation) {
        return parameters().put("reservation", reservation);
    }
}
