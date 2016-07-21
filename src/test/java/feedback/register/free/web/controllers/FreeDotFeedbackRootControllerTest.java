package feedback.register.free.web.controllers;

import com.topspectrum.data.dao.ApplicationContextAwareTestBase;
import com.topspectrum.data.dao.EmailLogRepository;
import com.topspectrum.mail.EmailAuditService;
import com.topspectrum.test.TestUtil;
import com.topspectrum.whois.WhoisRecord;
import com.topspectrum.whois.WhoisRecordBuilder;
import com.topspectrum.whois.WhoisRecordRepository;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationRepository;
import feedback.register.free.services.ApprovalService;
import feedback.register.free.services.DomainRegistrationService;
import feedback.register.free.services.FreeReservationWelcomeService;
import feedback.services.VerificationService;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import javax.validation.constraints.NotNull;

import static org.junit.Assert.*;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/4/16
 */
@SuppressWarnings({"unchecked", "all"})
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/java-api-servlet.xml"})
public class FreeDotFeedbackRootControllerTest extends ApplicationContextAwareTestBase {

    private static final Logger LOGGER = LoggerFactory.getLogger(FreeDotFeedbackRootControllerTest.class);

    @Autowired
    WhoisRecordRepository whoisRecordRepository;

    @Autowired
    FreeDotFeedbackRootController controller;

    @Autowired
    FreeReservationWelcomeService service;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    EmailAuditService emailAuditService;

    @Autowired
    EmailLogRepository emailLogRepository;

    @Autowired
    ApprovalService approvalService;

    @Autowired
    @Qualifier("freeTransactionManager")
    JpaTransactionManager transactionManager;

    @Autowired
    DomainRegistrationService domainRegistrationService;

    @Before
    public void setUp() throws Exception {
        assertNotNull(controller);
    }

    @Test
    @Transactional("freeTransactionManager")
    public void testTransaction() throws Exception {


    }

    //region suggestion
    @Test
    @Transactional("freeTransactionManager")
    public void service_testCustomerSuggestionEmail() throws Exception {
        assertTrue(TransactionSynchronizationManager.isActualTransactionActive());
        assertFalse(TransactionSynchronizationManager.isCurrentTransactionReadOnly());

//        assertEquals(Status.STATUS_ACTIVE, transactionManager.);

        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = reservation();

        reservation
                .markCheckout()
                .markSuggested(verificationService.generate("free.feedback", reservation.getEmail()));

        reservation = freeReservationRepository.save(reservation);

        service.sendCustomerSuggestionEmail(reservation);

        assertEquals(1, emailLogRepository.count());
    }

    @Test
    @Transactional("freeTransactionManager")
    public void service_testOperationsSuggestionEmailAndSlack() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = reservation();

        reservation.markSuggested(verificationService.generate("free.feedback", reservation.getEmail()));

        reservation = freeReservationRepository.save(reservation);

        service.sendOperationsSuggestionEmail(reservation);
        service.sendOperationsSuggestionSlackEvent(reservation);

        assertEquals(1, emailLogRepository.count());
    }

    @Test
    @Transactional("freeTransactionManager")
    public void service_testCustomerSuggestionEmail_1() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = reservation();

        reservation.markSuggested(verificationService.generate("free.feedback", reservation.getEmail()));

        reservation = freeReservationRepository.save(reservation);

        service.sendCustomerSuggestionEmail(reservation);
        service.sendOperationsSuggestionEmail(reservation);
        service.sendOperationsSuggestionSlackEvent(reservation);

        assertEquals(2, emailLogRepository.count());
    }
    //endregion

    //region approval
    @Test
    @Transactional("freeTransactionManager")
    public void service_testCustomerApprovalEmail() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = freeReservationRepository.save(reservation())
                .markCheckout()
                .markPendingApproval();

        service.sendCustomerApprovalEmail(reservation);

        assertEquals(1, emailLogRepository.count());
    }

    @Test
    @Transactional("freeTransactionManager")
    public void service_testOperationsApprovalEmail() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = freeReservationRepository.save(reservation())
                .markCheckout()
                .markPendingApproval();

        service.sendOperationsApprovalEmail(reservation);

        assertEquals(1, emailLogRepository.count());
    }

    @Test
    @Transactional("freeTransactionManager")
    public void service_testOperationsApprovalSlackEvent() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = freeReservationRepository.save(reservation())
                .markCheckout()
                .markPendingApproval();

        service.sendOperationsApprovalSlackEvent(reservation);

        assertEquals(0, emailLogRepository.count());
    }
    //endregion

    //region confirmation
    @Test
    @Transactional("freeTransactionManager")
    public void service_testCustomerConfirmationEmail() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = reservation()
                .markCheckout()
                .markPendingApproval()
                .markApproved(true);

        reservation = domainRegistrationService.getOrCreateAccount(reservation);

        service.sendCustomerConfirmationEmail(reservation);

        assertEquals(1, emailLogRepository.count());
    }

    @Test
    @Transactional("freeTransactionManager")
    public void service_testOperationsConfirmationEmail() throws Exception {
        assertEquals(0, emailLogRepository.count());

        FreeReservation reservation = reservation()
                .markCheckout()
                .markPendingApproval()
                .markApproved(true);

        reservation = domainRegistrationService.getOrCreateAccount(reservation);

//        domainRegistrationService.

//        reservation
//                .markPurchased();

        service.sendOperationsConfirmationEmail(reservation);

        assertEquals(1, emailLogRepository.count());
    }
    //endregion

    @NotNull
    protected FreeReservation reservation() {
        FreeReservation reservation = new FreeReservation();

        {
            reservation.setEmail(TestUtil.randomCustomerEmailAddress());
            reservation.setSourceFullDomainName(TestUtil.randomFullDomainName("com"));
            reservation.setDestinationFullDomainName(TestUtil.randomFullDomainName());

            {
                final WhoisRecord record = new WhoisRecordBuilder()
                        .name("Johnny Testit")
                        .organization("The mafia")
                        .phone("+1 (913) 980-2972")
                        .email(TestUtil.randomCustomerEmailAddress("UnitTest", "randomer.com"))
                        .address("1234 Fake St", "Seattle", "WA", "98118", "USA")
                        .fullDomainName(reservation.getDestinationFullDomainName())
                        .build();

                whoisRecordRepository.save(record);

                reservation.setDestinationWhoisRecord(record);
            }

        }

        return freeReservationRepository.save(reservation);
    }


    protected FreeReservation approve(FreeReservation reservation) {
        reservation.setApprovalDate(DateTime.now());

        return reservation;
    }

    protected FreeReservation checkout(FreeReservation reservation) {
        reservation.setCheckoutDate(DateTime.now());

        return reservation;
    }

    @Autowired
    VerificationService verificationService;

    protected FreeReservation withPendingVerification(FreeReservation reservation) {
        reservation.setPendingVerificationToken(verificationService.generate("free.feedback", reservation.getEmail()));

        return reservation;
    }
}