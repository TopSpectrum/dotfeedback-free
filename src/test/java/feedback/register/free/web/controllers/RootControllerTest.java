package feedback.register.free.web.controllers;

import com.topspectrum.data.dao.ApplicationContextAwareTestBase;
import com.topspectrum.test.TestUtil;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.WhoisRecord;
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
    RootController controller;

    @Before
    public void setUp() throws Exception {
        assertNotNull(controller);
    }

    @Test
    public void testCustomerVerificationEmail() throws Exception {
        // This verification email does not consider the pending status

        controller.sendCustomerVerificationEmail(reservation());
    }

    @Test
    public void testOperationsConfirmIdentity() throws Exception {
        FreeReservation reservation = reservation();

        controller.sendAdminAwarenessPreorderEmail(reservation);
    }

    @Test
    public void testCompanyConfirmationEmail_confirmed() throws Exception {
        FreeReservation reservation = reservation();

        controller.sendCompanyConfirmationEmail(reservation);
    }

    @Test
    public void testCustomerConfirmation_pending() throws Exception {
        FreeReservation reservation = reservation();

        reservation.setPendingPolicyApproval(true);

        controller.sendCustomerConfirmationEmail(reservation);
    }

    @Test
    public void testCustomerConfirmation_confirmed() throws Exception {
        FreeReservation reservation = reservation();

        reservation.setPendingPolicyApproval(false);

        controller.sendCustomerConfirmationEmail(reservation);
    }

    @Test
    public void testCompanyConfirmationEmail_pending() throws Exception {
        FreeReservation reservation = reservation();

        reservation.setPendingPolicyApproval(true);

        controller.sendCompanyConfirmationEmail(reservation);
    }

    protected FreeReservation reservation() {
        Long id = TestUtil.nextId();

        FreeReservation reservation = new FreeReservation() {
            public Long getId() {
                return id;
            }
        };

        {
            reservation.setVerifiedDate(DateTime.now());
            reservation.setEmail(TestUtil.randomCustomerEmailAddress());
            reservation.setSourceFullDomainName(TestUtil.randomFullDomainName("com"));
            reservation.setDestinationFullDomainName(TestUtil.randomFullDomainName());


            WhoisRecord record = new WhoisRecord();

            {
                record.setAdminName("Johnny Testit");
                record.setAdminOrganization("The mafia");
                record.setAdminPhone("+1 (913) 980-2972");
                record.setAdminEmail(TestUtil.randomCustomerEmailAddress("UnitTest", "randomer.com"));
                record.setAdminStreet("1234 Fake St");
                record.setAdminCity("Seattle");
                record.setAdminPostal("90210");
                record.setAdminState("Kansas");
                record.setAdminCountry("Pakistan");
            }

            reservation.setDestinationWhoisRecord(record);

            PendingVerificationToken pendingVerificationToken = new PendingVerificationToken();

            {
                pendingVerificationToken.setToken(UUID.randomUUID().toString());
                pendingVerificationToken.setCode(TestUtil.random());
            }

            reservation.setPendingVerificationToken(pendingVerificationToken);

        }

        return reservation;
    }
}