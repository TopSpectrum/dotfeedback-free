package feedback.register.free.whois;

import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.util.StringUtils;
import com.topspectrum.cache.CacheService;
import feedback.register.free.cache.NullCacheService;
import org.apache.commons.net.whois.WhoisClient;
import org.joda.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by msmyers on 11/5/15.
 */
public class IanaWhoisConnection extends WhoisConnectionBase {

    private static final Logger LOGGER = LoggerFactory.getLogger(IanaWhoisConnection.class);

    Pattern pattern = Pattern.compile("^(.{0,30}?)?:(.{0,512})$", Pattern.MULTILINE);

    InetAddress host;
    CacheService cacheService = new NullCacheService();

    public IanaWhoisConnection() {
        try {
            host = InetAddress.getByName("whois.iana.org");
        } catch (UnknownHostException e) {
            throw new IllegalStateException("whois.iana.org", e);
        }
    }

    @NotNull
    @Override
    protected String execute(String fullDomainName) throws Exception {
        String serverName = fetchRealWhoisServer(fullDomainName);
//        Whois Server: whois.markmonitor.com

        final Duration expirationDuration = Duration.standardDays(30);

        final String actualServerResponse;
        final String topLevelDomainName = DomainNameUtils.getTopLevelDomainName(fullDomainName.toLowerCase());

        if("com".equals(topLevelDomainName) || "net".equals(topLevelDomainName)){
            actualServerResponse = fetchBlob("domain " + fullDomainName, InetAddress.getByName(serverName), expirationDuration);
        } else {
            actualServerResponse = fetchBlob(fullDomainName, InetAddress.getByName(serverName), expirationDuration);
        }

        Map<String, String> properties = getProperties(actualServerResponse);
        String whoisServer = properties.get("Whois Server");

        if (StringUtils.isBlank(whoisServer)) {
            return actualServerResponse;
        } else {
            return fetchBlob(fullDomainName, InetAddress.getByName(whoisServer), expirationDuration);
        }
    }

    protected String fetchRealWhoisServer(String fullDomainName) throws IOException {
        String blob = fetchBlob(fullDomainName, host, Duration.standardDays(1));

        // parse into key value pairs.
        Map<String, String> properties = getProperties(blob);

        return properties.get("whois");
    }

    public Map<String, String> getProperties(String whois) {
        whois = trimToEnd(whois);

        Matcher matcher = pattern.matcher(whois);
        Map<String, String> result = new HashMap<>();

        while (matcher.find()) {
            String line = matcher.group(0);
            String key = matcher.group(1);
            String value = matcher.group(2);

            String existing = result.get(key);

            if (null != existing) {
                value = existing + ", " + value;
            }

            result.put(key.trim(), value.trim());
        }

        return result;
    }

    protected String fetchBlob(String fullDomainName, InetAddress host, Duration expirationDuration) throws IOException {
        // Check the database cache first
        String key = "whois:" + host.toString() + ":" + fullDomainName;
        String blob = cacheService.opt(key);

        if (StringUtils.isNotBlank(blob)) {
            return blob;
        }

        WhoisClient client = new WhoisClient();

        client.setConnectTimeout(20000);
        client.setDefaultTimeout(20000);
        client.connect(host);

        try {
            String query = client.query(fullDomainName);

            LOGGER.debug("Raw whois: " + query);

            cacheService.put(key, query, expirationDuration);

            return query;
        } finally {
            client.disconnect();
        }
    }


    /**
     * The WHOIS results contain bullshit comments after the >>> characters.
     *
     * @param whois
     * @return
     */
    private String trimToEnd(String whois) {
        whois = whois.trim();

        if (org.apache.commons.lang3.StringUtils.isEmpty(whois)) {
            return whois;
        }

        // Find the >>> chars
        int index = whois.indexOf(">>>");

        if (index == -1) {
            return whois;
        }

        return org.apache.commons.lang3.StringUtils.left(whois, index);
    }

    public InetAddress getHost() {
        return host;
    }

    public void setHost(InetAddress host) {
        this.host = host;
    }

    public CacheService getCacheService() {
        return cacheService;
    }

    public void setCacheService(CacheService cacheService) {
        this.cacheService = cacheService;
    }
}
