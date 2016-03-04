package feedback.register.web.controllers.whois.data;

import com.topspectrum.registry.PropertyLoader;
import feedback.web.data.WhoisRecord;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by msmyers on 11/5/15.
 */
public class DefaultWhoisParser implements WhoisParser {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultWhoisParser.class);

    Pattern pattern = Pattern.compile("^(.{0,30}?)?:(.{0,512})$", Pattern.MULTILINE);

    public ResponseType getResponseType(String whois) {
        if (StringUtils.isEmpty(whois)) {
            return ResponseType.UNKNOWN;
        }

        if (StringUtils.containsIgnoreCase(whois, "not found") || StringUtils.containsIgnoreCase(whois, "no match")) {
            return ResponseType.NOT_FOUND;
        }

        if (whois.contains("Domain Name: ")) {
            return ResponseType.RECORD;
        }

        if (whois.contains(">>>")) {
            return ResponseType.RECORD;
        }

        return ResponseType.NOT_FOUND;
    }

    public void apply(String whois, WhoisRecord record) {
        Map<String, String> pairs = getProperties(whois);

        if (MapUtils.isEmpty(pairs)) {
            return;
        }

        for (String key : pairs.keySet()) {
            String value = pairs.get(key);

            try {
                if (StringUtils.isBlank(value)) {
                    continue;
                }

                if (!PropertyLoader.isProperty(record.getClass(), key)) {
                    LOGGER.error("{} not a valid property", key);
                    continue;
                }

                PropertyLoader.apply(record, key, value);
            } catch (IllegalAccessException e) {
                LOGGER.error("Failed to access property for " + record.getFullDomainName(), e);
//                System.exit(2);
            }
        }
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

    /**
     * The WHOIS results contain bullshit comments after the >>> characters.
     *
     * @param whois
     * @return
     */
    private String trimToEnd(String whois) {
        whois = whois.trim();

        if (StringUtils.isEmpty(whois)) {
            return whois;
        }

        // Find the >>> chars
        int index = whois.indexOf(">>>");

        if (index == -1) {
            return whois;
        }

        return StringUtils.left(whois, index);
    }
}
