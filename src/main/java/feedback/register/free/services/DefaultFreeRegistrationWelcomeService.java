package feedback.register.free.services;

import com.google.common.collect.Maps;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.whois.WhoisRecordBuilder;
import feedback.register.free.data.FreeRegistrationAccount;
import feedback.register.free.data.FreeReservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * @author msmyers
 * @since 6/22/16
 */
@Service
public class DefaultFreeRegistrationWelcomeService implements FreeRegistrationWelcomeService {

    @Autowired
    TemplatedEmailService templatedEmailService;

    @Override
    public void send(@NotNull FreeReservation reservation) throws Exception {
        final Map<String, Object> parameters = Maps.newHashMapWithExpectedSize(10);

        final WhoisIdentity identity = reservation.toWhoisIdentity(WhoisRecordBuilder.CommonAgent.Registrant);

        {
            parameters.put("identity", identity);
            parameters.put("reservation", reservation);
        }

        templatedEmailService.send(identity.getEmail(), null, "email.suggested.confirm-identity", parameters);
    }

    public TemplatedEmailService getTemplatedEmailService() {
        return templatedEmailService;
    }

    public void setTemplatedEmailService(TemplatedEmailService templatedEmailService) {
        this.templatedEmailService = templatedEmailService;
    }
}
