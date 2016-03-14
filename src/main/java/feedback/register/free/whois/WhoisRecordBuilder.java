package feedback.register.free.whois;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */

import com.google.common.base.CaseFormat;
import com.google.common.base.Preconditions;
import com.topspectrum.registry.ParsedDomainParts;
import com.topspectrum.registry.PropertyField;
import com.topspectrum.registry.PropertyLoader;
import com.topspectrum.util.CollectionUtils;
import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.util.PropertyUtils;
import feedback.register.free.data.WhoisRecord;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotNull;
import java.util.Map;
import java.util.Set;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 5/8/15
 */
public class WhoisRecordBuilder {

    //    private static final Pattern pattern = Pattern.compile("(.*): +(.*)");
    private static final Logger LOGGER = LoggerFactory.getLogger(WhoisRecordBuilder.class);

    private static Map<String, PropertyField> KNOWN_PROPERTIES =
            PropertyLoader.properties(WhoisRecord.class, true);

    private WhoisRecord template = new WhoisRecord();
    private boolean touched;

//    public WhoisRecordBuilder nameServer(String value) {
//        template.setName_server(value);
//
//        return touched();
//    }

    public enum CommonAgent {
        Registrant,
        Admin,
        Tech,
        Billing,
    }

    public enum CommonPart {
        id,
        name,
        organization,
        street,
        city,
        state,
        postal,
        country,
        phone,
        phone_ext,
        fax,
        fax_ext,
        email
    }

    public WhoisRecordBuilder() {

    }

    public WhoisRecordBuilder(WhoisRecord template) {
        this.template = template;
        if (this.template.getCreatedDate() == null) {
            this.template.setCreatedDate(new DateTime());
        }
    }

    public boolean isTouched() {
        return touched;
    }

    public WhoisRecordBuilder touched(boolean touched) {
        this.touched = touched;
        return this;
    }

    public WhoisRecordBuilder touched() {
        return this.touched(true);
    }

//    public static Map<String, String> parts(@NotNull final String content) {
//        final Map<String, String> map = new HashMap<>();
//        final String[] parts = content.split("\n");
//
//        for (String part : parts) {
//            Matcher matcher = pattern.matcher(part);
//
//            if (!matcher.find()) {
//                LOGGER.trace("Not matching: {}", part);
//                continue;
//            }
//
//            String key = matcher.group(1);
//            String value = matcher.group(2);
//
//            if (LOGGER.isTraceEnabled()) {
//                LOGGER.trace("{} = {}", key, value);
//            }
//
//            map.put(key, value);
//        }
//
//        return map;
//    }

    public boolean isParsableProperty(@NotNull final String parameterName) {
        return KNOWN_PROPERTIES.containsKey(StringUtils.lowerCase(parameterName));
    }

    public WhoisRecordBuilder name(String name) {
        set(CommonPart.name, name);

        return touched();
    }



    public WhoisRecordBuilder phone(String phone) {
        set(CommonPart.phone, phone);

        return touched();
    }

    public WhoisRecordBuilder phone(String phone, String phoneExt) {
        set(CommonPart.phone, phone);
        set(CommonPart.phone_ext, phoneExt);

        return touched();
    }

    public WhoisRecordBuilder fax(String fax, String faxExt) {
        set(CommonPart.fax, fax);
        set(CommonPart.fax_ext, faxExt);

        return touched();
    }

    public WhoisRecordBuilder email(String email) {
        set(CommonPart.email, email);

        return touched();
    }

    public WhoisRecordBuilder domainName(String domainName) {
        template.setDomainName(domainName);

        return touched();
    }

    public WhoisRecordBuilder fullDomainName(String fullDomainName) {
        ParsedDomainParts parts = ParsedDomainParts.fromFullDomainNameWithSlug(fullDomainName);

        template.setFullDomainName(fullDomainName);
        template.setDomainName(parts.getCustomerDomainName());

        return touched();
    }

    public WhoisRecordBuilder address(String street, String city, String state, String postal) {
        return address(street, city, state, postal, "US");
    }

    public WhoisRecordBuilder set(CommonAgent agent, CommonPart part, String value) {
        String property = CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, agent.toString() + "_" + part.toString());

        if (LOGGER.isTraceEnabled()) {
            LOGGER.trace("{} set [{}]=[{}]", this.template, property, value);
        }

        PropertyUtils.invokeSetter(this.template, property, value);

        return touched();
    }

    public WhoisRecordBuilder set(String fieldName, Set<?> values) throws IllegalAccessException {
        int size = CollectionUtils.size(values);
        if (0 == size) {
            return set(fieldName, (String) null);
        } else if (1 == size) {
            return set(fieldName, CollectionUtils.first(values));
        }

        Preconditions.checkArgument(isParsableProperty(fieldName), "%s is not a valid property", fieldName);

        PropertyField pf = KNOWN_PROPERTIES.get(fieldName.toLowerCase());

        PropertyLoader.apply(template, pf, values);

        return this;
    }

    public WhoisRecordBuilder set(String fieldName, Object value) throws IllegalAccessException {
        // Strange......


        Preconditions.checkArgument(isParsableProperty(fieldName), "%s is not a valid property", fieldName);

        PropertyField pf = KNOWN_PROPERTIES.get(fieldName.toLowerCase());

        PropertyLoader.apply(template, pf, value);

        return touched();
    }

    public WhoisRecordBuilder set(CommonPart part, String value) {
        for (CommonAgent agent : CommonAgent.values()) {
            set(agent, part, value);
        }

        return touched();
    }

    public WhoisRecordBuilder address(String street, String city, String state, String postal, String country) {
        set(CommonPart.street, street);
        set(CommonPart.city, city);
        set(CommonPart.postal, postal);
        set(CommonPart.state, state);
        set(CommonPart.country, country);

        return touched();
    }

    public WhoisRecord build() {
        // TODO: don't be so sloppy.
        return template;
    }
}
