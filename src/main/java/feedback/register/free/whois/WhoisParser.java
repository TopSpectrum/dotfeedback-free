package feedback.register.free.whois;

import feedback.register.free.data.WhoisRecord;

import java.util.Map;

/**
 * Created by msmyers on 11/5/15.
 */
public interface WhoisParser {

    ResponseType getResponseType(String whois);

    void apply(String whois, WhoisRecord record);

    Map<String, String> getProperties(String whois);

}
