package com.topspectrum.interop.internetbs;

import com.ning.http.client.AsyncHttpClient;
import com.topspectrum.registry.WhoisIdentity;
import com.zipwhip.concurrent.ObservableFuture;
import feedback.register.free.interop.internetbs.*;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

/**
 * @author msmyers
 * @since 6/20/16
 */
@Ignore
public class DefaultInternetBSClientTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultInternetBSClientTest.class);

    AsyncHttpClient asyncHttpClient = new AsyncHttpClient();
    DefaultInternetBSClient client = new DefaultInternetBSClient(asyncHttpClient);

    @Before
    public void setUp() throws Exception {
        client.setBaseUrl("https://testapi.internet.bs");
        client.setApiKey("testapi");
        client.setPassword("testpass");
    }

    @Test
    public void testTemporaryPassword() throws Exception {
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());
        LOGGER.debug(DefaultInternetBSClient.getTemporaryPassword());

        assertEquals(13, DefaultInternetBSClient.getTemporaryPassword().length());
    }

//    @Test
//    public void testRegister() throws Exception {
//        switchToProduction();
//
////        https://api.internet.bs/subaccount/delegate/domain?apikey=APIKEY&password=PASSWORD&username=USERNAME&domains=DOMAIN1,DOMAIN2
//
//        WhoisIdentity identity = identity();
//        String fullDomainName = TestUtil.randomFullDomainName();
//
//        ObservableFuture<RegistrationResult> future = client.register(identity, fullDomainName);
//
//        future.await();
//
//        RegistrationResult result = future.getResult();
//
//        if (!future.isSuccess()) {
//            LOGGER.error("Failed", future.getCause());
//        }
//
//        assertTrue(future.isSuccess());
//    }

    @Test
    public void testListAccount() throws Exception {
//        https://api.internet.bs/Domain/List?apiKey=I1C3K5U1Q3A3O9U8L8H1&password=d%7D%402b5m%26%7BuZ7L%5DmQ
        switchToProduction();

        ObservableFuture<ListDomainsResult> future = client.listDomains();

        future.await();

        if (future.isFailed()) {
            LOGGER.debug("failed to create", future.getCause());
        }

        assertTrue(future.isSuccess());

        ListDomainsResult result = future.getResult();

        assertNotNull(result);
        assertTrue(result.getDomainCount() > 1000);
        assertTrue(result.getDomains().size() > 1000);
    }

    @Test
    public void testDuplicateAccountInProduction() throws Exception {
        switchToProduction(); // THIS WORKS IN PRODUCTION

        ObservableFuture<ApiResult> account = client.createAccount(DefaultInternetBSClient.getUsernameFromEmail("ops@topspectrum.com"), "ops@topspectrum.com", "password", "FirstName", "LastName", "US");

        account.await();

        if (account.isFailed()) {
            LOGGER.debug("failed to create", account.getCause());
        }

        assertTrue(account.isSuccess());
    }

//    @Test
//    public void testAssignDomain() throws Exception {
//        switchToProduction();
//
//        ApiResult hostmastermarshallscouk = client.assignDomain("hostmastermarshallscouk", "marshalls.feedback").get();
//    }

    protected void switchToProduction() {
        client.setBaseUrl("https://api.internet.bs");
        client.setApiKey("I1C3K5U1Q3A3O9U8L8H1");
        client.setPassword("d}@2b5m&{uZ7L]mQ");
    }

    protected WhoisIdentity identity() {
        WhoisIdentity identity = new WhoisIdentity();

        identity.setName("Unit Test");
        identity.setEmail("ops@topspectrum.com");
        identity.setStreet("1845 W Mercer Way");
        identity.setCity("Seattle");
        identity.setState("WA");
        identity.setCountry("US");
        identity.setPostal("98119");
        identity.setPhone("19139802972");

        return identity;
    }

    @Test
    public void testCreate() throws Exception {

        WhoisIdentity identity = identity();

        ObservableFuture<?> register = client.registerDomain(identity, UUID.randomUUID().toString() + ".com");

        register.await(30, TimeUnit.SECONDS);

        if (register.isFailed()) {
            LOGGER.debug("Failed", register.getCause());
        }

        assertTrue(register.isSuccess());

        assertNotNull(register.getResult());
    }

    @Test
    public void testError() throws Exception {
        client.setApiKey(UUID.randomUUID().toString());

        ObservableFuture<AvailabilityResult> future = client.isAvailable("test.com");

        future.await(5, TimeUnit.MINUTES);

        assertTrue(future.isDone());
        assertTrue(future.isFailed());

        Throwable t = future.getCause();

        assertNotNull(t);
        assertTrue(t instanceof RequestFailedException);

        RequestFailedException e = (RequestFailedException) t;

        assertNotNull(e.getResult());
        assertEquals((Integer) 107002, e.getResult().getCode());
        assertEquals("Invalid API key and/or Password", e.getResult().getMessage());
        assertEquals("FAILURE", e.getResult().getStatus());
    }

    @Test
    public void testAvailable() throws Exception {
        AvailabilityResult result = client.isAvailable(UUID.randomUUID().toString() + ".com").get();

        assertNotNull(result);
        assertTrue(result.isAvailable());
        assertNotEquals("ERROR", result.getStatus());
    }

    @Test
    public void testUnavailable() throws Exception {
        AvailabilityResult result = client.isAvailable("taken.com").get();

        assertNotNull(result);
        assertFalse(result.isAvailable());
        assertNotEquals("ERROR", result.getStatus());
    }
}