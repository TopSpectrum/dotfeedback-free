package feedback.register.free.web.controllers;

import com.topspectrum.data.dao.ApplicationContextAwareTestBase;
import com.topspectrum.test.TestUtil;
import com.topspectrum.whois.WhoisRecordBuilder;
import com.topspectrum.whois.WhoisRecordRepository;
import feedback.register.free.data.FreeReservation;
import com.topspectrum.whois.WhoisRecord;
import feedback.register.free.data.FreeReservationRepository;
import feedback.register.free.services.FreeReservationWelcomeService;
import feedback.register.free.web.model.FreeReservationToken;
import feedback.register.free.web.model.FreeReservationTokenWrapper;
import feedback.services.VerificationService;
import feedback.web.data.PendingVerificationToken;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

import java.util.UUID;

import static org.junit.Assert.assertNotNull;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/4/16
 */
@SuppressWarnings({"unchecked", "all"})
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/java-api-servlet.xml"})
public class RootControllerTest extends ApplicationContextAwareTestBase {

    private static final Logger LOGGER = LoggerFactory.getLogger(RootControllerTest.class);

    @Autowired
    WhoisRecordRepository whoisRecordRepository;

    @Autowired
    RootController controller;

    @Autowired
    FreeReservationWelcomeService service;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Before
    public void setUp() throws Exception {
        assertNotNull(controller);
    }

    @Test
    public void service_testCustomerSuggestionEmail() throws Exception {
        FreeReservation reservation = reservation();

        reservation.markSuggested();

        reservation = freeReservationRepository.save(reservation);

        service.sendCustomerSuggestionEmail(reservation);
        service.sendOperationsSuggestionEmail(reservation);
        service.sendOperationsSuggestionSlackEvent(reservation);

        //TODO Have assertions
    }

    @Test
    public void service_testSuggestedDomain() throws Exception {
        FreeReservationTokenWrapper wrapper = new FreeReservationTokenWrapper(new FreeReservationToken(reservation().markSuggested()));

        FreeReservation reservation = controller.parseAndSaveReservationOrFail(wrapper);

        reservation = freeReservationRepository.save(reservation);

        service.sendCustomerSuggestionEmail(reservation);
    }

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

        return reservation;
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