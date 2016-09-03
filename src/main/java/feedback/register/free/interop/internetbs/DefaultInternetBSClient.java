package feedback.register.free.interop.internetbs;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.google.i18n.phonenumbers.Phonenumber;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.Response;
import com.topspectrum.json.JsonUtils;
import com.topspectrum.names.NameUtil;
import com.topspectrum.names.Named;
import com.topspectrum.net.AsyncHttpClientUtil;
import com.topspectrum.phone.PhoneNumberUtil;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.util.MorePreconditions;
import com.topspectrum.util.StringUtils;
import com.zipwhip.concurrent.ObservableFuture;
import com.topspectrum.location.CountryCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.Map;
import java.util.regex.MatchResult;
import java.util.regex.Pattern;

/**
 * @author msmyers
 * @since 6/20/16
 */
public class DefaultInternetBSClient implements InternetBSClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultInternetBSClient.class);

    private String apiKey;
    private String password;

    private AsyncHttpClient client;
    private String baseUrl;

    public DefaultInternetBSClient(AsyncHttpClient client) {
        this.client = client;
    }

    public DefaultInternetBSClient() {

    }

    @NotNull
    @Override
    public ObservableFuture<CreateDomainResult> registerDomain(@NotNull final WhoisIdentity identity, @NotNull final String fullDomainName) {
        Map<String, Object> request = new CreateDomainRequest(identity, fullDomainName)
                .toMap();

        AsyncHttpClient.BoundRequestBuilder builder = prepareGet("/Domain/Create");

        builder.addQueryParam("domain", fullDomainName);

        AsyncHttpClientUtil.addQueryParam(builder, request);

        return execute(builder, CreateDomainResult.class);
    }

    @NotNull
    public ObservableFuture<ListDomainsResult> listDomains() {
        AsyncHttpClient.BoundRequestBuilder builder = prepareGet("/Domain/List");

        return execute(builder, ListDomainsResult.class);
    }

    @NotNull
    @Override
    public ObservableFuture<AvailabilityResult> isAvailable(@NotNull final String fullDomainName) {
        AsyncHttpClient.BoundRequestBuilder builder = prepareGet("/Domain/Check");

        builder.addQueryParam("Domain", fullDomainName);

        return execute(builder, AvailabilityResult.class);
    }

//    @NotNull
//    public ObservableFuture<ApiResult> createAccount(@NotNull final String username, @NotNull String email, @NotNull String password, @NotNull String displayName) {
//        Named named = NameUtil.parse(displayName);
//        String firstName = StringUtils.defaultString(named.getFirstName(), "Guest");
//        String lastName = StringUtils.defaultString(named.getLastName());
//
//        return createAccount(username, email, password, firstName, lastName, "US");
//    }

    @NotNull
    @Override
    public ObservableFuture<ApiResult> createAccount(@NotNull String username, @NotNull String email, @NotNull String password, @NotNull String firstName, @NotNull String lastName, @NotNull String countryCode) {
        AsyncHttpClient.BoundRequestBuilder builder = prepareGet("/subaccount/create");

        // TODO: further sanitize it?

        firstName = StringUtils.defaultIfBlank(firstName, StringUtils.defaultIfBlank(lastName, "Admin"));
        lastName = StringUtils.defaultIfBlank(lastName, firstName);

        builder.addQueryParam("firstname", firstName);
        builder.addQueryParam("lastname", lastName);
        builder.addQueryParam("username", username);
        builder.addQueryParam("email", email);
        builder.addQueryParam("userpass", password);
        builder.addQueryParam("countrycode", countryCode);

        return execute(builder, ApiResult.class);
    }

    @NotNull
    @Override
    public ObservableFuture<ApiResult> assignDomain(@NotNull String username, @NotNull String fullDomainName) {
        AsyncHttpClient.BoundRequestBuilder builder = prepareGet("/subaccount/delegate/domains");

        // TODO: further sanitize it?

        builder.addQueryParam("username", username);
        builder.addQueryParam("domains", fullDomainName);

        return execute(builder, ApiResult.class);
    }

    @NotNull
    @Override
    public String getVendorId() {
        return "internet.bs";
    }

    @NotNull
    protected AsyncHttpClient.BoundRequestBuilder prepareGet(@NotNull final String path) {
        return addCredentials(client.prepareGet(baseUrl + path));
    }

    @NotNull
    protected AsyncHttpClient.BoundRequestBuilder addCredentials(@NotNull final AsyncHttpClient.BoundRequestBuilder builder) {
        builder.addQueryParam("ApiKey", apiKey);
        builder.addQueryParam("Password", password);
        builder.addQueryParam("ResponseFormat", "json");

        return builder;
    }

    @NotNull
    @SuppressWarnings("ConstantConditions")
    protected ObservableFuture<Map<String, Object>> execute(AsyncHttpClient.BoundRequestBuilder builder) {
        return AsyncHttpClientUtil.execute(builder, response -> {
            String bodyAsString = AsyncHttpClientUtil.toString(response);

            LOGGER.debug("body: {}", bodyAsString);

            checkFailure(response, bodyAsString);

            return JsonUtils.asMap(bodyAsString);
        });
    }

    @NotNull
    @SuppressWarnings("ConstantConditions")
    protected <T> ObservableFuture<T> execute(AsyncHttpClient.BoundRequestBuilder builder, @NotNull final Class<T> clazz) {
        return AsyncHttpClientUtil.execute(builder, response -> {
            String bodyAsString = AsyncHttpClientUtil.toString(response);

            LOGGER.debug("body: {}", bodyAsString);

            checkFailure(response, bodyAsString);

            return JsonUtils.fromJson(AsyncHttpClientUtil.toString(response), clazz);
        });
    }

    protected void checkFailure(Response response, String bodyAsString) throws RequestFailedException {
        HttpStatus httpStatus = HttpStatus.valueOf(response.getStatusCode());

        if (httpStatus.is4xxClientError() || httpStatus.is5xxServerError()) {
            throw new RuntimeException("Unknown error: " + httpStatus);
        }

        if (StringUtils.containsIgnoreCase(bodyAsString, "\"status\":\"FAILURE\"") && StringUtils.containsIgnoreCase(bodyAsString, "\"code\":")) {
            // It's an error
            ErrorResult result = Preconditions.checkNotNull(JsonUtils.fromJson(bodyAsString, ErrorResult.class));

            if (Integer.valueOf(100002).equals(result.getCode())) {
                MatchResult m = StringUtils.toMatchResult(Pattern.compile("^(?:.*?)\"(.*?)\"(?:.*?)\"(.*?)\"(?:.*?)?"), result.getMessage());

                if (null != m) {
                    String parameterValue = m.group(1);
                    String parameterName = m.group(2);

                    throw new InvalidParameterRequestFailedException(result, parameterName, parameterValue);
                }
            }

            throw new RequestFailedException(result);
        }
    }

    //region getter/setter
    public AsyncHttpClient getClient() {
        return client;
    }

    public void setClient(AsyncHttpClient client) {
        this.client = client;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    //endregion

    //region statics

    //region CreateDomainRequest
    public static class CreateDomainRequest {

        @NotNull
        private final WhoisIdentity identity;

        @NotNull
        private final String fullDomainName;

        public CreateDomainRequest(@NotNull WhoisIdentity identity, @NotNull final String fullDomainName) {
            this.identity = identity;
            this.fullDomainName = fullDomainName;
        }

        @NotNull
        public String getFullDomainName() {
            return fullDomainName;
        }

        @NotNull
        public WhoisIdentity getIdentity() {
            return identity;
        }

        @NotNull
        private String serializeCountryCode(@Nullable final String country) {
            return Preconditions.checkNotNull(CountryCodes.convert(country), "Country code did not validate: " + country);
        }

        @Nullable
        private String serializePhoneNumber(@Nullable final String phoneNumber) {
            if (StringUtils.isBlank(phoneNumber)) {
                return null;
            }

            Phonenumber.PhoneNumber normalized = Preconditions.checkNotNull(PhoneNumberUtil.normalize(phoneNumber));

            LOGGER.debug(normalized.toString());

            return normalized.getCountryCode() + "." + normalized.getNationalNumber();
        }


        public enum IdentityPart {
            Registrant,
            Admin,
            Technical,
            Billing;
        }

        @NotNull
        public Map<String, Object> toMap() {
            Map<String, Object> result = Maps.newHashMapWithExpectedSize(30);

            for (IdentityPart part : IdentityPart.values()) {
                Named parse = NameUtil.parse(identity.getName());

                String firstName = StringUtils.defaultIfBlank(parse.getFirstName(), StringUtils.defaultIfBlank(parse.getLastName(), "Admin"));
                String lastName = StringUtils.defaultIfBlank(parse.getLastName(), firstName);

                result.put(part.name() + "_" + "FirstName", firstName);
                result.put(part.name() + "_" + "LastName", lastName);

                result.put(part.name() + "_" + "Email", identity.getEmail());
                result.put(part.name() + "_" + "PhoneNumber", serializePhoneNumber(identity.getPhone()));
                result.put(part.name() + "_" + "Organization", identity.getOrganization());

                result.put(part.name() + "_" + "Street", DefaultInternetBSClient.ninjaTrim(identity.getStreet(), identity.getCity()));
                result.put(part.name() + "_" + "Street2", "");
                result.put(part.name() + "_" + "Street3", identity.getState());
                result.put(part.name() + "_" + "City", identity.getCity());
                result.put(part.name() + "_" + "CountryCode", serializeCountryCode(identity.getCountry()));
                result.put(part.name() + "_" + "PostalCode", identity.getPostal());
            }

            return result;
        }

    }
    //endregion

    @NotNull
    public static String getUsernameFromEmail(@NotNull final String email) {
        MorePreconditions.checkNotBlank(email);

        String string = org.apache.commons.lang3.StringUtils.replaceEach(email, new String[]{"@", ".", "-", "+"}, new String[]{"", "", "", ""});

        if (string.length() > 20) {
            string = StringUtils.substring(string, 0, 20) + org.apache.commons.lang3.RandomUtils.nextInt(1000, 10000);
        }

        return string;
    }

    @Nullable
    public static RequestFailedException optRequestFailedException(@Nullable final Throwable t) {
        if (null == t) {
            return null;
        }

        if (!(t instanceof RequestFailedException)) {
            return null;
        }

        return (RequestFailedException) t;
    }

    public static boolean isAccountExistsError(@Nullable final Throwable t) {
        RequestFailedException e = optRequestFailedException(t);

        if (null == e) {
            return false;
        }

        ErrorResult response = e.getResult();

        return (Integer.valueOf(100039).equals(response.getCode()));
    }

    public static String getTemporaryPassword() {
        return "FEEDBACK-" + ((int) ((Math.random() * 9000) + 1000));
    }

    //endregion

    // 6F, Tower B, Chuangxin Building, Xiamen Torch High-tech Zone Software Park, Xiamen, Fujian, China.
    public static String ninjaTrim(String street, String city) {
        street = StringUtils.superTrim(street);
        city = StringUtils.superTrim(city);

        if (StringUtils.containsIgnoreCase(street, city)) {
            street = StringUtils.substringBeforeLast(street, city);
        }

        street = StringUtils.trim(street);
        street = org.apache.commons.lang3.StringUtils.stripStart(street, ",.");
        street = StringUtils.trim(street);
        street = org.apache.commons.lang3.StringUtils.stripEnd(street, ",.");

        return StringUtils.substringByWord(street, null, 60);
    }
}
