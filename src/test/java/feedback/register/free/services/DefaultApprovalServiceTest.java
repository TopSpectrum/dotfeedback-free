package feedback.register.free.services;

import com.topspectrum.data.dao.ApplicationContextAwareTestBase;
import com.topspectrum.test.TestUtil;
import com.topspectrum.whois.WhoisRecord;
import com.topspectrum.whois.WhoisRecordBuilder;
import com.topspectrum.whois.WhoisRecordRepository;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationRepository;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * @author msmyers
 * @since 7/12/16
 */
@Component
public class DefaultApprovalServiceTest extends ApplicationContextAwareTestBase {

    @Autowired
    DefaultApprovalService defaultApprovalService;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    WhoisRecordRepository whoisRecordRepository;

    private WhoisRecord record1;

    private WhoisRecord record2;

    @Before
    public void setUp() throws Exception {
        assertNotNull(defaultApprovalService);

        record1 = new WhoisRecordBuilder()
                .fullDomainName(TestUtil.randomFullDomainName())
                .name(TestUtil.randomDisplayName())
                .email(TestUtil.randomCustomerEmailAddress())
                .build();

        whoisRecordRepository.save(record1);

        record2 = new WhoisRecordBuilder()
                .fullDomainName(TestUtil.randomFullDomainName())
                .name(TestUtil.randomDisplayName())
                .email(TestUtil.randomCustomerEmailAddress())
                .build();

        whoisRecordRepository.save(record2);
    }

    @Test
    public void testIt() throws Exception {
        FreeReservation reservation1 = new FreeReservation();

        {
            reservation1.setDestinationFullDomainName(record1.getFullDomainName());
            reservation1.setDestinationWhoisRecord(record1);
            reservation1.setEmail(record1.getRegistrantEmail());
            reservation1.setPendingPolicyApproval(false);
            reservation1.setPurchaseDate(DateTime.now());

            freeReservationRepository.save(reservation1);
        }

        FreeReservation reservation2 = new FreeReservation();

        {
            reservation2.setDestinationFullDomainName(record1.getFullDomainName());
            reservation2.setDestinationWhoisRecord(record1);
            reservation2.setEmail(record1.getRegistrantEmail());
            reservation2.setPendingPolicyApproval(true);

            freeReservationRepository.save(reservation2);
        }

//        defaultApprovalService.requestApproval(reservation1);

        String token = defaultApprovalService.generateToken(reservation1);

        assertNotNull(token);
        assertNotNull(defaultApprovalService.getByToken(token));
        assertEquals(reservation1, defaultApprovalService.getByToken(token));
    }
}