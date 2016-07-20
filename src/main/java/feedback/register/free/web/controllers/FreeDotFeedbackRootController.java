package feedback.register.free.web.controllers;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Joiner;
import com.google.common.base.Preconditions;
import com.topspectrum.data.PageUtils;
import com.topspectrum.mail.EmailAuditService;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.registry.ParsedDomainParts;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.services.GoogleDocService;
import com.topspectrum.slack.SlackService;
import com.topspectrum.template.EmailTemplateService;
import com.topspectrum.util.ConversionUtils;
import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.util.StringUtils;
import com.topspectrum.web.util.ExceptionUtils;
import com.topspectrum.whois.WhoisConnection;
import com.topspectrum.whois.WhoisRecord;
import com.topspectrum.whois.WhoisRecordBuilder;
import com.topspectrum.whois.WhoisRecordRepository;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservationRepository;
import feedback.register.free.data.ReferralCodeRepository;
import feedback.register.free.interop.internetbs.DomainRegistrationService;
import feedback.register.free.services.ApprovalService;
import feedback.register.free.services.FreeReservationWelcomeService;
import feedback.register.free.web.model.FreeReservationToken;
import feedback.register.free.web.model.FreeReservationTokenWrapper;
import feedback.services.VerificationService;
import feedback.web.controllers.exceptions.RestExceptions;
import feedback.web.data.JpaContextHelper;
import feedback.web.data.PendingVerificationToken;
import feedback.web.data.Site;
import feedback.web.data.services.SiteService;
import feedback.web.security.SecurityUtil;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 9/7/15
 */
@Controller
public class FreeDotFeedbackRootController implements InitializingBean {

    private static final Logger LOGGER = LoggerFactory.getLogger(FreeDotFeedbackRootController.class);

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
    @Qualifier("feedbackWhoisConnection")
    WhoisConnection feedbackWhoisConnection;

    @Autowired
    @Qualifier("xmlApiWhoisConnection")
    WhoisConnection xmlApiWhoisConnection;

    @Autowired
    @Qualifier("whoisConnection")
    WhoisConnection whoisConnection;

    @Autowired
    TemplatedEmailService templatedEmailService;

    @Autowired
    JpaContextHelper contextHelper;

    @Autowired
    EmailTemplateService emailTemplateService;

    @Autowired
    ReferralCodeRepository referralCodeRepository;

    @Autowired
    SiteService siteService;

    @Autowired
    DomainRegistrationService domainRegistrationService;

    @Autowired
    FreeReservationWelcomeService freeReservationWelcomeService;

    @Autowired
    ApprovalService approvalService;

    @Autowired
    EmailAuditService emailAuditService;

    @Autowired
    SlackService slackService;

    @Override
    public void afterPropertiesSet() throws Exception {

        // Disabled this check so we can support "Name <email>" syntax.
//        Preconditions.checkState(StringUtils.isValidEmail(internalCompanyEmail), "must be valid email: " + internalCompanyEmail);
    }

    //region docs
    @RequestMapping(value = "/")
    @ResponseBody
    public String index() {
        return "api/v1";
    }

    @RequestMapping("/terms")
    @ResponseBody
    public String load_terms() throws InterruptedException, ExecutionException, IOException {
        // TODO: cache this.
        return googleDocService.getByDocumentId("1uvUkiVj0nnsONfHaT98uIljQ7CGKTuWBmOrM2pwVBzM");
    }

    @RequestMapping("/intro")
    @ResponseBody
    public String load_intro() throws InterruptedException, ExecutionException, IOException {
        // TODO: cache this.
        return googleDocService.getByDocumentId("13Mx9WVlsr5Jh0ytMM47EzR_RxlHW13iNeLFYPwtRsYs");
    }

    @RequestMapping("/privacy")
    @ResponseBody
    public String load_privacy() throws InterruptedException, ExecutionException, IOException {
        // TODO: cache this.
        // TODO: find the right documentId
        return googleDocService.getByDocumentId("1sI_2D2AlYgsZPU5YU1DPNR4lk2nQ21moER9ml-_Mnn0");
    }
    //endregion

//    @Transactional("freeTransactionManager")
//    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
//    @ResponseBody
//    public Object checkout(HttpServletRequest request) throws Exception {
//        FreeReservation reservation = getSavedReservation(request);
//
//        // TOOD: validate the reservation.
//        // TODO: allow for modification of the WHOIS information
//
//        reservation.setPendingPolicyApproval(hasExistingReservationsForThisEmail(reservation.getEmail()));
//        reservation.setCheckoutDate(DateTime.now());
//
//        freeReservationRepository.save(reservation);
//
//        // Nuke it so no replays.
//        request.getSession().invalidate();
//
//        return null;
//    }

    /**
     * Called when Operations approves a reservation.
     *
     * @param request
     * @param approved
     * @param token
     * @return
     * @throws Exception
     */
    @Transactional("freeTransactionManager")
    @RequestMapping(value = "/approval", method = RequestMethod.GET)
    @ResponseBody
    public Object approval(HttpServletRequest request,
                           @RequestParam("approved") Boolean approved,
                           @RequestParam("token") String token
    ) {
        try {
            Preconditions.checkNotNull(approved);

            FreeReservation reservation = RestExceptions.checkNotFound(approvalService.getByToken(token), "Token was invalid.");

            reservation
                    .markApproved(approved);

            if (approved) {
                // TODO: we need to execute the purchase and send an email with the username/password
                executeActualPurchase(reservation);

                // this service will send both the APPROVED/REJECTED email templates correctly.
                freeReservationWelcomeService.send(reservation);
            }

            return "yes: " + reservation.getId();
        } catch (Throwable e) {
            return "no:<pre>" + ExceptionUtils.getStackTrace(e) + "</pre>";
        }
    }

    protected FreeReservation executeActualPurchase(FreeReservation reservation) {
        LOGGER.error("WE PRETENDED TO EXECUTE THE PURCHASE");


        return reservation.markPurchased();
    }

    /**
     * Called when the customer wants to claim a domain name.
     *
     * @param reservationToken
     * @return
     * @throws Exception
     */
    @Transactional("freeTransactionManager")
    @RequestMapping(value = "/claim", method = RequestMethod.GET)
    @ResponseBody
    public Object claim(
            @RequestParam("reservation") String reservationToken
    ) throws Exception {
        @Nullable
        final PendingVerificationToken pendingVerificationToken = verificationService.getByToken("free.feedback/suggestion", reservationToken);

        if (null == pendingVerificationToken) {
            return "redirect:/claim/error";
        }

        @Nullable
        final FreeReservation reservation = freeReservationRepository.findByPendingVerificationToken(pendingVerificationToken);

        if (null == reservation) {
            return "redirect:/claim/error";
        }

        @Nullable
        WhoisIdentity identity = reservation.toWhoisIdentity();

        if (null == identity) {
            return "redirect:/claim/error";
        }

        FreeReservationAccount account = domainRegistrationService.getOrCreateAccount(identity);

        return "redirect:/claim";
    }

    //region /referralCodes
    @RequestMapping("/referralCodes")
    @ResponseBody
    public Map<String, Object> list_referral_codes() {

        Map<String, Object> result = new HashMap<>();

        {
            result.put("referral-code", referralCodeRepository.findAllByExpirationDateAfterOrExpirationDateIsNull(DateTime.now()));

        }

        return result;
    }
    //endregion

    //region /reservations

//    @RequestMapping(value = "/reservations", method = RequestMethod.GET)
//    @ResponseBody
//    public FreeReservationTokenWrapper get_sessioned_reservation(HttpServletRequest request) {
//        FreeReservation reservation = (FreeReservation) request.getSession().getAttribute("DATA");
//
//        if (null == reservation) {
//            RestExceptions.notFound("Nothing saved.");
//        }
//
//        return new FreeReservationTokenWrapper(new FreeReservationToken(reservation));
//    }

    /***
     * Triggered when a customer has decided to buy.
     * <p>
     * - Save WHOIS record with the customer information
     * - Save the reservation
     * - Send email challenge (url with confirmation/token)
     *
     * @param wrapper
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     * @throws IOException
     * @throws MessagingException
     */
    @ResponseBody
    @RequestMapping(value = "/reservations", method = RequestMethod.POST)
    @Transactional("freeTransactionManager")
    public FreeReservationTokenWrapper submit_reservation(
            @RequestBody FreeReservationTokenWrapper wrapper
    ) throws Exception {
        // The flow: https://docs.google.com/drawings/d/1YE0mzFSdsrmQTeHtIu97vRD3dLKUK3AXCY6_QJGNAww

        // Step 1, gather the info.
        // This will throw a BadRequest exception if it's not fully valid.
        FreeReservation reservation = parseAndSaveReservationOrFail(wrapper);

        // Step 2, in this new design, we auto checkout.
        checkout(reservation);

        freeReservationWelcomeService.send(reservation);

        // The customer wants to know the ID? Not exactly sure how valuable it is to tell the customer this info.
        // My understanding is that they can close the window after making this call, since we are sending an email.
        wrapper.getReservation().setId(reservation.getId());
        wrapper.getReservation().setPendingPolicyApproval(reservation.isPendingPolicyApproval());
        wrapper.getReservation().setCheckoutDate(reservation.getCheckoutDate());

        return wrapper;
    }
    //endregion

    @NotNull
    protected FreeReservation checkout(@NotNull final FreeReservation reservation) throws Exception {
        RestExceptions.checkBadRequest(isAvailable(reservation.getDestinationFullDomainName()));

        //preconditions
        {
            reservation
                    .shouldBeReady()
                    .shouldNotBeCheckout()
                    .shouldLackApprovalDecision()
                    .shouldNotBePurchased();
        }

        // business logic
        {
            reservation
                    .markCheckout();

            if (reservation.isSuggested()) {
                reservation
                        .markSuggested(verificationService.generate("free.feedback/suggestion", reservation.getEmail()));
            } else {
                boolean hasExisting = hasExistingReservationsForThisEmail(reservation.getEmail());

                if (hasExisting) {
                    reservation.markPendingApproval();
                } else {
                    reservation.markPendingApproval();
                    reservation.markApproved();

                    executeActualPurchase(reservation);
                }
            }
        }

        return freeReservationRepository.save(reservation);
    }

    //region /protected-registrations

    /**
     * This is accessed via the browser when they click the link.
     *
     * @param website
     * @param protectedFor
     * @param approvedBy
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/protected-registrations", method = RequestMethod.GET)
    @ResponseBody
    public Object find_protected_registration(
            @RequestParam(value = "website") String website,
            @RequestParam(value = "protectedFor") String protectedFor,
            @RequestParam(value = "approvedBy") String approvedBy
    ) throws Exception {
        final String code = RestExceptions.badRequestIfBlank(approvedBy.replace("lauren", ""));
        final String email = RestExceptions.checkBadRequest(StringUtils.ifValidEmail(protectedFor));
        final PendingVerificationToken pendingVerificationToken = RestExceptions.checkNotFound(verificationService.getByCode("free.feedback/suggestion", email, code));
        final FreeReservation reservation = RestExceptions.checkNotFound(freeReservationRepository.findByPendingVerificationToken(pendingVerificationToken));

        reservation.shouldBeSuggested();

        return new FreeReservationToken(reservation);
    }

    @ResponseBody
    @RequestMapping(value = "/reservations/{id}", method = RequestMethod.PUT)
    @Transactional("freeTransactionManager")
    public Object finish_protected_registration(
            @NotNull @PathVariable("id") Long id,
            @RequestBody FreeReservationTokenWrapper wrapper
    ) throws Exception {
        // Step 1, gather the info.
        // This will throw a BadRequest exception if it's not fully valid.
        RestExceptions.checkNotFound(id);

        @Nonnull
        FreeReservation reservation = update(RestExceptions.checkNotFound(freeReservationRepository.findOne(id)), wrapper);

        reservation
                .shouldBeSuggested();

        executeActualPurchase(reservation);

        freeReservationWelcomeService.send(reservation);

        return new FreeReservationTokenWrapper(new FreeReservationToken(reservation));
    }

    //endregion

    //region /checkout

    /**
     * This is accessed via the browser when they click the link.
     *
     * @param request
     * @param token
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/checkout", method = RequestMethod.GET)
    public ModelAndView verify_email__verify_token(
            HttpServletRequest request,
            @RequestParam(value = "reservation", required = false) String token
    ) throws Exception {
        final PendingVerificationToken pendingVerificationToken = verificationService.getByToken("free.feedback", token);

        if (null == pendingVerificationToken) {
            return new ModelAndView("redirect:/failed");
        } else {
            FreeReservation reservation = freeReservationRepository.findByPendingVerificationToken(pendingVerificationToken);

            if (null == reservation) {
                return new ModelAndView("redirect:/failed");
            }

            if (null == reservation.getApprovalDate()) {
                reservation.setApprovalDate(DateTime.now());

                freeReservationRepository.save(reservation);
            }

            // We need to pull up their thingy.
            request.getSession().setAttribute("DATA", reservation);

            return new ModelAndView("redirect:/checkout");
        }
    }
    //endregion

    //region /availabilities/fullDomainName
    @RequestMapping(value = "/availabilities/{fullDomainName:.+}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> query_available(
            HttpServletRequest request,
            @PathVariable("fullDomainName") String fullDomainName
    ) throws Exception {
        RestExceptions.checkBadRequest(fullDomainName, DomainNameUtils::isValidDotFeedbackFullDomainName);

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
    //endregion

    //region /whois/fullDomainName
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

                whois.put("emailAlternatives", Joiner.on(";").skipNulls().join(
                        ConversionUtils.toStream(
                                ConversionUtils.toSet(
                                        whoisRecord.getAdminEmail(),
                                        whoisRecord.getBillingEmail(),
                                        whoisRecord.getRegistrantEmail(),
                                        whoisRecord.getAdminEmail(),
                                        whoisRecord.getTechEmail(),
                                        whoisRecord.getAbuseContactEmail(),
                                        whoisRecord.getRegistrarAbuseContactEmail()))
                                .map(StringUtils::trimToNull)
                                .map(StringUtils::toLowerCase)
                                .filter(StringUtils::isNotBlank)
                                .collect(Collectors.toSet())
                ));
            }

            result.put("whois", whois);
        }

        return result;
    }
    //endregion

    @VisibleForTesting
    protected boolean hasExistingReservationsForThisEmail(@NotNull final String email) {
        RestExceptions.checkBadRequest(email, StringUtils::isNotBlank);

        return PageUtils.isNotEmpty(freeReservationRepository.findByEmailAndPurchaseDateIsNotNullAndDeletedIsFalse(email, PageUtils.singleResult()));
    }

    @NotNull
    @VisibleForTesting
    protected FreeReservation parseAndSaveReservationOrFail(@NotNull final FreeReservationTokenWrapper wrapper) {
        final FreeReservation reservation = new FreeReservation();

        {
            final FreeReservationToken token = wrapper.getReservation();

            reservation.setDestinationFullDomainName(token.getDestinationFullDomainName());
            reservation.setDestinationWhoisRecord(parseWhoisRecordOrFail(token));

            reservation.setSourceFullDomainName(token.getSourceFullDomainName());
            reservation.setSourceWhoisRecord(findMostRecentWhoisRecord(reservation.getSourceFullDomainName()));

            reservation.setEmail(token.getEmail());

            reservation.setAffiliateCode(wrapper.getReservation().getAffiliateCode());
            reservation.setRemoteHost(SecurityUtil.currentRemoteHost());
            reservation.setFingerprint(SecurityUtil.currentFingerprint());

            reservation.setSuggested(wrapper.getReservation().isSuggested());
        }

        // The return value will have the ID set.
        return freeReservationRepository.save(reservation);
    }

    /**
     * Called during finalization of the 'suggested mode' flow
     *
     * @param reservation
     * @param wrapper
     * @return
     */
    @NotNull
    protected FreeReservation update(@NotNull final FreeReservation reservation, @NotNull final FreeReservationTokenWrapper wrapper) {
        WhoisRecord record = parseWhoisRecordOrFail(wrapper.getReservation(), Preconditions.checkNotNull(reservation.getDestinationWhoisRecord()));

        whoisRecordRepository.save(reservation.getDestinationWhoisRecord());

        reservation.setEmail(record.getRegistrantEmail());

        return reservation;
    }

    protected boolean isAvailable(@NotNull final String dotfeedbackFullDomainName) throws Exception {
        String availability = availability(dotfeedbackFullDomainName);

        return "available".equalsIgnoreCase(availability);
    }

    @NotNull
    @VisibleForTesting
    protected String availability(@NotNull final String dotfeedbackFullDomainName) throws Exception {
        RestExceptions.checkBadRequest(dotfeedbackFullDomainName, DomainNameUtils::isValidDotFeedbackFullDomainName);

        if (DomainNameUtils.isValidDotFeedbackFullDomainName(dotfeedbackFullDomainName)) {
            if (!PageUtils.isEmpty(freeReservationRepository.findByDestinationFullDomainNameAndPurchaseDateIsNotNull(dotfeedbackFullDomainName, PageUtils.newest()))) {
                return "registered";
            }
        }

        WhoisRecord record = findAndSaveMostRecentWhoisRecord(dotfeedbackFullDomainName);

        if (record.isNotFound()) {
            return "available";
        } else if (record.isFailed()) {
            return "unknown";
        } else if (record.isReserved()) {
            return "reserved";
        } else if ("FreeReservationDestination".equalsIgnoreCase(record.getSourceStrategy())) {
            List<FreeReservation> records = freeReservationRepository.findByDestinationWhoisRecord(record);

            FreeReservation reservation = ConversionUtils.toStream(records)
                    .filter((reservation1) -> {
                        if (null == reservation1) {
                            return false;
                        } else if (reservation1.isDeleted()) {
                            return false;
                        } else if (reservation1.isPendingPolicyApproval()) {
                            return false;
                        }

                        return reservation1.isPurchased();
                    })
                    .findFirst()
                    .orElse(null);

            if (null == reservation) {
                return "available";
            }
        }

        return "unavailable";
    }

    @NotNull
    @VisibleForTesting
    protected WhoisRecord findAndSaveMostRecentWhoisRecord(@NotNull final String fullDomainName) throws Exception {
        WhoisRecord record = findMostRecentWhoisRecord(fullDomainName);

        if (null == record) {
            if (DomainNameUtils.isOurTopLevelDomainName(DomainNameUtils.getTopLevelDomainName(fullDomainName))) {
                Site site = siteService.optSite(ParsedDomainParts.fromFullDomainNameWithSlug(fullDomainName));

                if (null != site) {
                    record = new WhoisRecord();

                    record.setFullDomainName(fullDomainName);
                    record.setFailed(false);
                    record.setNotFound(false);

                    return record;
                }

                record = feedbackWhoisConnection.queryForRecord(fullDomainName);

                if (!record.isFailed()) {
                    whoisRecordRepository.save(record);
                } else {
                    // the record failed.
                    // let's be hopeful

                    record = new WhoisRecord();

                    record.setFullDomainName(fullDomainName);
                    record.setFailed(false);
                    record.setNotFound(true);

                    return record;
                }
            } else {
                WhoisRecord record1 = xmlApiWhoisConnection.queryForRecord(fullDomainName);

                if (isHealthy(record1)) {
                    whoisRecordRepository.save(record1);

                    return record1;
                }

                WhoisRecord record2 = whoisConnection.queryForRecord(fullDomainName);

                if (isHealthy(record2)) {
                    record2 = new WhoisRecordBuilder(record2)
                            .merge(record1)
                            .build();

                    whoisRecordRepository.save(record2);

                    return record1;
                }

                WhoisRecord record3 = feedbackWhoisConnection.queryForRecord(fullDomainName);

                if (isHealthy(record3)) {
                    record3 = new WhoisRecordBuilder(record3)
                            .merge(record1)
                            .merge(record2)
                            .build();

                    whoisRecordRepository.save(record3);

                    return record1;
                }

                record = new WhoisRecordBuilder()
                        .merge(record1)
                        .merge(record2)
                        .merge(record3)
                        .build();

                if (record1.isFailed() || record2.isFailed() || record3.isFailed()) {
                    record.setFailed(true);
                }

                if (record1.isNotFound() || record2.isNotFound() || record3.isNotFound()) {
                    record.setNotFound(true);
                }

                whoisRecordRepository.save(record1);
                whoisRecordRepository.save(record2);
                whoisRecordRepository.save(record3);

                whoisRecordRepository.save(record);

                return record;
            }
        }

        return record;
    }

    @Nullable
    public WhoisRecord findMostRecentWhoisRecord(@NotNull final String fullDomainName) {
        DateTime createdDate = DateTime.now().minusDays(30);

        return PageUtils.first(whoisRecordRepository.findWhoisRecord(fullDomainName, createdDate, "whois", "FreeReservationDestination", PageUtils.newest()));
    }

//    @VisibleForTesting
//    public static boolean isMocked(@NotNull final WhoisRecord record) {
//        return (record.isMocked() || "FreeReservationDestination".equalsIgnoreCase(record.getSourceStrategy()));
//    }

    @VisibleForTesting
    protected static boolean isHealthy(WhoisRecord record) {
        return 3 >= getMissCount(record);
    }

    @VisibleForTesting
    protected static int getMissCount(WhoisRecord record) {
        int count = 0;

        if (!isSuccess(record)) {
            return 9;
        }

        WhoisRecordBuilder builder = new WhoisRecordBuilder(record);

        List<WhoisRecordBuilder.CommonPart> work = Arrays.asList(
                WhoisRecordBuilder.CommonPart.name,
                WhoisRecordBuilder.CommonPart.email,
                WhoisRecordBuilder.CommonPart.organization,
                WhoisRecordBuilder.CommonPart.street,
                WhoisRecordBuilder.CommonPart.city,
                WhoisRecordBuilder.CommonPart.state,
                WhoisRecordBuilder.CommonPart.postal,
                WhoisRecordBuilder.CommonPart.country,
                WhoisRecordBuilder.CommonPart.phone);

        for (WhoisRecordBuilder.CommonPart part : work) {
            boolean missing = StringUtils.isBlank(builder.get(WhoisRecordBuilder.CommonAgent.Registrant, part));

            if (missing) {
                count++;
            }
        }

        return count;
    }

    @NotNull
    @VisibleForTesting
    protected WhoisRecord parseWhoisRecordOrFail(@NotNull final FreeReservationToken token) {
        return whoisRecordRepository.save(
                parseWhoisRecordOrFail(token, new WhoisRecord())
        );
    }

    @VisibleForTesting
    protected WhoisRecord parseWhoisRecordOrFail(@NotNull final FreeReservationToken token, @Nullable final WhoisRecord record) {
        return new WhoisRecordBuilder(record)
                .sourceStrategy("FreeReservationDestination")
                .name(token.getName())
                .address(token.getStreet(), token.getCity(), token.getState(), token.getPostal(), token.getCountry())
                .email(token.getEmail())
                .fullDomainName(token.getDestinationFullDomainName())
                .phone(token.getPhone(), token.getPhoneExt())
                .fax(token.getFax(), token.getFaxExt())
                .registrar(token.getRegistrar())
                .type("reservation")
                .build();
    }

    protected static boolean isSuccess(@Nullable final WhoisRecord record) {
        if (null == record) {
            return false;
        }

        if (record.isNotFound() || record.isFailed()) {
            return false;
        }

        return true;
    }
}
