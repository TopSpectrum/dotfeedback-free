package feedback.register.web.controllers.whois;

import feedback.register.web.controllers.whois.data.DefaultWhoisParser;
import feedback.register.web.controllers.whois.data.ResponseType;
import feedback.register.web.controllers.whois.data.WhoisParser;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */
public class DefaultWhoisConnectionTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultWhoisConnectionTest.class);

    IanaWhoisConnection connection = new IanaWhoisConnection();
    WhoisParser whoisParser = new DefaultWhoisParser();

    @Before
    public void setUp() throws Exception {

    }

    @Test
    public void testName() throws Exception {
        String raw = "Domain Name: ASDF.COM\n" +
                "Registry Domain ID: 2339403_DOMAIN_COM-VRSN\n" +
                "Registrar WHOIS Server: whois.enom.com\n" +
                "Registrar URL: www.enom.com\n" +
                "Updated Date: 2014-08-14T08:47:14.00Z\n" +
                "Creation Date: 1998-11-04T05:00:00.00Z\n" +
                "Registrar Registration Expiration Date: 2017-11-03T05:00:00.00Z\n" +
                "Registrar: ENOM, INC.\n" +
                "Registrar IANA ID: 48\n" +
                "Reseller: NAMECHEAP.COM\n" +
                "Domain Status: clientTransferProhibited https://www.icann.org/epp#clientTransferProhibited\n" +
                "Registry Registrant ID: \n" +
                "Registrant Name: WHOISGUARD PROTECTED\n" +
                "Registrant Organization: WHOISGUARD, INC.\n" +
                "Registrant Street: P.O. BOX 0823-03411\n" +
                "Registrant City: PANAMA\n" +
                "Registrant State/Province: PANAMA\n" +
                "Registrant Postal Code: 00000\n" +
                "Registrant Country: PA\n" +
                "Registrant Phone: +507.8365503\n" +
                "Registrant Phone Ext: \n" +
                "Registrant Fax: +51.17057182\n" +
                "Registrant Fax Ext:\n" +
                "Registrant Email: 86AB962082ED443CB88908685A0CD784.PROTECT@WHOISGUARD.COM\n" +
                "Registry Admin ID: \n" +
                "Admin Name: WHOISGUARD PROTECTED\n" +
                "Admin Organization: WHOISGUARD, INC.\n" +
                "Admin Street: P.O. BOX 0823-03411\n" +
                "Admin City: PANAMA\n" +
                "Admin State/Province: PANAMA\n" +
                "Admin Postal Code: 00000\n" +
                "Admin Country: PA\n" +
                "Admin Phone: +507.8365503\n" +
                "Admin Phone Ext: \n" +
                "Admin Fax: +51.17057182\n" +
                "Admin Fax Ext:\n" +
                "Admin Email: 86AB962082ED443CB88908685A0CD784.PROTECT@WHOISGUARD.COM\n" +
                "Registry Tech ID: \n" +
                "Tech Name: WHOISGUARD PROTECTED\n" +
                "Tech Organization: WHOISGUARD, INC.\n" +
                "Tech Street: P.O. BOX 0823-03411\n" +
                "Tech City: PANAMA\n" +
                "Tech State/Province: PANAMA\n" +
                "Tech Postal Code: 00000\n" +
                "Tech Country: PA\n" +
                "Tech Phone: +507.8365503\n" +
                "Tech Phone Ext: \n" +
                "Tech Fax: +51.17057182\n" +
                "Tech Fax Ext: \n" +
                "Tech Email: 86AB962082ED443CB88908685A0CD784.PROTECT@WHOISGUARD.COM\n" +
                "Name Server: NS1.DREAMHOST.COM\n" +
                "Name Server: NS2.DREAMHOST.COM\n" +
                "Name Server: NS3.DREAMHOST.COM\n" +
                "DNSSEC: unSigned\n" +
                "Registrar Abuse Contact Email: abuse@enom.com\n" +
                "Registrar Abuse Contact Phone: +1.4252982646\n" +
                "URL of the ICANN WHOIS Data Problem Reporting System: http://wdprs.internic.net/\n" +
                "Last update of WHOIS database: 2014-08-14T08:47:14.00Z\n" +
                "\n" +
                "The data in this whois database is provided to you for information\n" +
                "purposes only, that is, to assist you in obtaining information about or\n" +
                "related to a domain name registration record. We make this information\n" +
                "available \"as is,\" and do not guarantee its accuracy. By submitting a\n" +
                "whois query, you agree that you will use this data only for lawful\n" +
                "purposes and that, under no circumstances will you use this data to: (1)\n" +
                "enable high volume, automated, electronic processes that stress or load\n" +
                "this whois database system providing you this information; or (2) allow,\n" +
                "enable, or otherwise support the transmission of mass unsolicited,\n" +
                "commercial advertising or solicitations via direct mail, electronic\n" +
                "mail, or by telephone. The compilation, repackaging, dissemination or\n" +
                "other use of this data is expressly prohibited without prior written\n" +
                "consent from us.  \n" +
                "\n" +
                "We reserve the right to modify these terms at any time. By submitting \n" +
                "this query, you agree to abide by these terms.\n" +
                "Version 6.3 4/3/2002";

        Map<String, String> properties = whoisParser.getProperties(raw);

        assertEquals(ResponseType.RECORD, whoisParser.getResponseType(raw));

        assertNotNull(properties);
    }

    @Ignore
    @Test
    public void testCom() throws Exception {
        String raw_whois_data = connection.execute("microsoft.com");
        Map<String, String> properties = whoisParser.getProperties(raw_whois_data);

        LOGGER.error("WHOIS: {}", raw_whois_data);

        assertNotNull(properties);
        assertTrue(20 < properties.size());
    }

    @Ignore
    @Test
    public void testFeedback_taken() throws Exception {
        String raw_whois_data = connection.execute("free.feedback");
        Map<String, String> properties = whoisParser.getProperties(raw_whois_data);

        LOGGER.error("WHOIS: {}", raw_whois_data);

        assertNotNull(properties);
        assertTrue(20 < properties.size());
    }

    @Ignore
    @Test
    public void testFeedback_reserved() throws Exception {
        String raw_whois_data = connection.execute("apple.feedback");
        Map<String, String> properties = whoisParser.getProperties(raw_whois_data);

        LOGGER.error("WHOIS: {}", raw_whois_data);

        assertNotNull(properties);
        assertTrue(raw_whois_data.contains("RESERVED"));
        assertTrue(60 < properties.size());
    }

    @Ignore
    @Test
    public void testFeedback_available() throws Exception {
        String raw_whois_data = connection.execute("free-asdfasdfasdfasdfasdfsad.feedback");
        Map<String, String> properties = whoisParser.getProperties(raw_whois_data);

        LOGGER.error("WHOIS: {}", raw_whois_data);

        assertNotNull(properties);
        assertTrue(0 == properties.size());
    }
}