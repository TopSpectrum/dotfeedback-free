package feedback.register.free.web.controllers;

import com.google.common.collect.Maps;
import com.topspectrum.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Map;
import java.util.MissingResourceException;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 7/21/16
 */
public class CountryCodes {

    private static final Logger LOGGER = LoggerFactory.getLogger(CountryCodes.class);

    private static final Map<String, Locale> LOCALE_MAP;

    static {
        Map<String, Locale> builder = Maps.newHashMapWithExpectedSize(Locale.getAvailableLocales().length * 2);

        //Do this once
        for (String country : Locale.getISOCountries()) {
            Locale locale = new Locale("", country);

            builder.put(sanitize(locale.getDisplayCountry()), locale);
            builder.put(sanitize(locale.getCountry()), locale);

            try {
                builder.put(sanitize(locale.getISO3Country()), locale);
            } catch (MissingResourceException ignored) {
            }
        }

        LOCALE_MAP = builder;
    }

//    String[] countriesList = Locale.getISOCountries();
//
//  System.out.println("ID \t COUNTRY CODE \t COUNTRY NAME");
//
//  for (String country : countriesList) {
//
//        Locale tmp = new Locale("", country);

    @NotNull
    private static String sanitize(@Nullable final String displayCountry) {
        String lowerCase = StringUtils.toLowerCase(displayCountry);
        String result = StringUtils.defaultString(StringUtils.removeSpaces(lowerCase));

        if (StringUtils.equalsIgnoreCase(result, "uk")) {
            result = "gb";
        }

        LOGGER.debug("Sanitized {} into {}", displayCountry, result);

        return result;
    }

    @Nullable
    public static String convert(@Nullable final String countryCodeOrCountryName) {
        if (StringUtils.isBlank(countryCodeOrCountryName)) {
            return null;
        }

        String string = sanitize(countryCodeOrCountryName);

        Locale locale = LOCALE_MAP.get(string);

        if (null == locale) {
            LOGGER.error("Could not find Locale via {}", string);

            return null;
        } else {
            String result = locale.getCountry();

            LOGGER.debug("Found {} for {}", result, countryCodeOrCountryName);

            return result;
        }
    }
}
