package feedback.register.free.web.controllers;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 7/21/16
 */
public class CountryCodesTest {

    @Test
    public void name() throws Exception {

        assertEquals("GB", CountryCodes.convert("UK"));
        assertEquals("KY", CountryCodes.convert("Cayman Islands"));

    }
}