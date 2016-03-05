package feedback.register.free.whois;

import feedback.register.free.data.WhoisRecord;

import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * Created by msmyers on 11/5/15.
 */
public interface WhoisConnection {

    @NotNull
    WhoisRecord queryForRecord(String fullDomainName) throws Exception;

    @NotNull
    Map<String, String> queryForProperties(String fullDomainName) throws Exception;

    @NotNull
    String queryForRaw(String fullDomainName) throws Exception;

}
