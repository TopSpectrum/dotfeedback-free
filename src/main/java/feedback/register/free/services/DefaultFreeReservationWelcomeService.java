package feedback.register.free.services;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.whois.WhoisRecordBuilder;
import feedback.register.free.data.FreeReservation;
import feedback.web.data.PendingVerificationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * @author msmyers
 * @since 6/22/16
 */
@Service
public class DefaultFreeReservationWelcomeService implements FreeReservationWelcomeService {

    @Autowired
    TemplatedEmailService templatedEmailService;

    @Value("${feedback.free.url}")
    String baseUrl;

    @Override
    public void send(@NotNull final FreeReservation reservation) throws Exception {
        final Map<String, Object> parameters = Maps.newHashMapWithExpectedSize(10);

        final WhoisIdentity identity = Preconditions.checkNotNull(reservation.toWhoisIdentity(WhoisRecordBuilder.CommonAgent.Registrant), "identity");
        final String email = Preconditions.checkNotNull(identity.getEmail(), "email");
        final String url = buildUrl(reservation);

        {
            parameters.put("url", url);
            parameters.put("identity", identity);
            parameters.put("reservation", reservation);
        }

        templatedEmailService.send(email, null, "email.customer.suggestion", parameters);
    }

    private String buildUrl(FreeReservation reservation) {
        PendingVerificationToken token = reservation.getPendingVerificationToken();

        return UriComponentsBuilder.fromHttpUrl("http://" + baseUrl + "/api/v1/claim")
                .queryParam("reservation", token.getToken())
                .toUriString();
    }

    public TemplatedEmailService getTemplatedEmailService() {
        return templatedEmailService;
    }

    public void setTemplatedEmailService(TemplatedEmailService templatedEmailService) {
        this.templatedEmailService = templatedEmailService;
    }
}
