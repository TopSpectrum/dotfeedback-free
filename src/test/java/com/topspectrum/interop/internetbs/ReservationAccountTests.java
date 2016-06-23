package com.topspectrum.interop.internetbs;

import com.topspectrum.data.dao.ApplicationContextAwareTestBase;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.names.NameUtil;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.template.EmailTemplateService;
import com.topspectrum.test.TestUtil;
import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.whois.WhoisRecord;
import com.topspectrum.whois.WhoisRecordBuilder;
import com.topspectrum.whois.WhoisRecordRepository;
import feedback.register.free.data.FreeRegistrationAccount;
import feedback.register.free.data.FreeRegistrationAccountRepository;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationRepository;
import feedback.register.free.interop.internetbs.DomainRegistrationService;
import feedback.register.free.interop.internetbs.MockDomainRegistrationService;
import feedback.register.free.services.FreeRegistrationWelcomeService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.UUID;

import static org.junit.Assert.*;

/**
 * @author msmyers
 * @since 6/21/16
 */
public class ReservationAccountTests extends ApplicationContextAwareTestBase {

    @Autowired
    FreeRegistrationAccountRepository freeRegistrationAccountRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    WhoisRecordRepository whoisRecordRepository;

    DomainRegistrationService service;

    @Autowired
    TemplatedEmailService templatedEmailService;

    @Autowired
    EmailTemplateService emailTemplateService;

    @Autowired
    FreeRegistrationWelcomeService freeRegistrationWelcomeService;

    @Before
    public void setUp() throws Exception {
        service = new MockDomainRegistrationService();

        ((MockDomainRegistrationService)service).setFreeRegistrationAccountRepository(freeRegistrationAccountRepository);
    }

    //region Database Tests
    @Test
    public void testAutowiring() throws Exception {
        assertNotNull(freeRegistrationAccountRepository);
        assertNotNull(freeReservationRepository);
        assertNotNull(templatedEmailService);
    }

    @Test
    public void testSaveAndRead() throws Exception {
        FreeRegistrationAccount account = new FreeRegistrationAccount();

        account.setDisplayName("Michael Smyers");
        account.setEmail(TestUtil.randomCustomerEmailAddress());
        account.setFirstName(NameUtil.getFirstName(account.getDisplayName()));
        account.setLastName(NameUtil.getLastName(account.getDisplayName()));

        assertNull(account.getId());

        freeRegistrationAccountRepository.save(account);

        assertNotNull(account.getId());

        FreeRegistrationAccount one = freeRegistrationAccountRepository.findOne(account.getId());

        assertEquals(one, account);
    }

    @Test
    public void testSendEmail() throws Exception {
        WhoisIdentity identity = identity();

        identity.setEmail("michael@topspectrum.com");

        FreeReservation reservation1 = reservation(whoisRecord(identity));

        freeRegistrationWelcomeService.send(reservation1);
    }

    public WhoisIdentity identity() {
        WhoisIdentity identity = new WhoisIdentity();

        identity.setName(TestUtil.randomCustomerName());
        identity.setEmail(TestUtil.randomCustomerName());
        identity.setAddress(TestUtil.randomAddress());
        identity.setEmail(TestUtil.randomCustomerEmailAddress());
        identity.setPhone(TestUtil.randomPhoneNumber());
        identity.setFax(TestUtil.randomPhoneNumber());
        identity.setOrganization("Test Organization");

        return identity;
    }

    public WhoisRecord whoisRecord(WhoisIdentity identity) {
        return new WhoisRecordBuilder()
                .identity(identity)
                .fullDomainName(TestUtil.randomFullDomainName())
                .registrar("Internet.BS")
                .build();
    }

    @NotNull
    public FreeReservation reservation(@NotNull final WhoisRecord record) {

        final FreeReservation reservation = new FreeReservation();

        {
            reservation.setAffiliateCode(UUID.randomUUID().toString());

            reservation.setDestinationFullDomainName(record.getFullDomainName());
            reservation.setSourceFullDomainName(DomainNameUtils.setTopLevelDomain(record.getFullDomainName(), "com"));

            reservation.setEmail(record.getRegistrantEmail());

            reservation.setRemoteHost("127.0.0.1");
            reservation.setFingerprint(UUID.randomUUID().toString());

            reservation.setDestinationWhoisRecord(record);
        }

        // Save the customer WHOIS.
        whoisRecordRepository.save(reservation.getDestinationWhoisRecord());

        // The return value will have the ID set.
        return freeReservationRepository.save(reservation);
    }

    //endregion

}
