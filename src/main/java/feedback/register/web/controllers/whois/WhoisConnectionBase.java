package feedback.register.web.controllers.whois;

import com.google.common.util.concurrent.RateLimiter;
import com.topspectrum.registry.ParsedDomainParts;
import com.topspectrum.util.DomainNameUtils;
import feedback.register.web.controllers.whois.data.DefaultWhoisParser;
import feedback.register.web.controllers.whois.data.ResponseType;
import feedback.register.web.controllers.whois.data.WhoisParser;
import feedback.web.data.WhoisRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Map;

/**
 * Created by msmyers on 11/5/15.
 */
public abstract class WhoisConnectionBase implements WhoisConnection {

    private static final Logger LOGGER = LoggerFactory.getLogger(WhoisConnectionBase.class);

    private WhoisParser parser = new DefaultWhoisParser();

    private RateLimiter rateLimiter = RateLimiter.create(1);

    public WhoisConnectionBase() {

    }

    public WhoisConnectionBase(RateLimiter rateLimiter) {
        this.rateLimiter = rateLimiter;
    }

    @NotNull
    @Override
    public String queryForRaw(String fullDomainName) throws Exception {
        return acquireAndExecute(fullDomainName);
    }

    @NotNull
    @Override
    public Map<String, String> queryForProperties(String fullDomainName) throws Exception {
        return parser.getProperties(acquireAndExecute(fullDomainName));
    }

    @NotNull
    @Override
    public WhoisRecord queryForRecord(String fullDomainName) {
        WhoisRecord record = createStubRecord(fullDomainName);

        String raw;

        try {
            raw = acquireAndExecute(fullDomainName);

            if (null == raw) {
                // It was skipped.
                return null;
            }

            record.setRaw(raw);
        } catch (Exception e) {
            LOGGER.error("Failed to queryForRecord", e);
            record.setFailed(true);
            return record;
        }

        ResponseType responseType = parser.getResponseType(raw);

        switch (responseType) {
            case NOT_FOUND: {
                record.setNotFound(true);
                return record;
            }
            case RECORD: {
                // Good.
                parser.apply(raw, record);
                return record;
            }
            case BANNED:
            case UNKNOWN:
                record.setFailed(true);
                return record;
            default:
                record.setFailed(true);
                throw new IllegalStateException("Unknown type: " + responseType);
        }
    }

    @NotNull
    protected WhoisRecord createStubRecord(String fullDomainName) {
        WhoisRecord record = new WhoisRecord();

        {
            record.setDiscoveryDate(new Date());
            record.setSourceStrategy(this.getClass().getSimpleName());
            record.setNotFound(false);
            record.setFailed(false);

            record.setFullDomainName(fullDomainName);
            ParsedDomainParts parts = DomainNameUtils.parse(fullDomainName);
            record.setSourceLabel(parts.getCustomerDomainName());
            record.setSourceSuffix(parts.getTopLevelDomainName());
        }

        return record;
    }

    @NotNull
    protected String acquireAndExecute(String fullDomainName) throws Exception {
        rateLimiter.acquire();

        return execute(fullDomainName);
    }

    @NotNull
    protected abstract String execute(@NotNull String fullDomainName) throws Exception;

}
