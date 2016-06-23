package feedback.register.free.interop.internetbs;

import com.google.common.base.Preconditions;
import com.topspectrum.feedback.register.data.ReservationDomain;
import com.topspectrum.names.NameUtil;
import com.topspectrum.names.Named;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.util.FutureUtils;
import com.topspectrum.util.StringUtils;
import com.zipwhip.concurrent.ObservableFuture;
import feedback.register.free.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nonnull;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;


/**
 * @author msmyers
 * @since 6/21/16
 */
@Service
public class DefaultDomainRegistrationService implements DomainRegistrationService {

    @Autowired
    FreeRegistrationAccountRepository freeRegistrationAccountRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    InternetBSClient client;

    public FreeRegistrationAccount getOrCreateAccount(FreeReservation reservation) throws Exception {
        FreeRegistrationAccount account = freeRegistrationAccountRepository.findByEmail(reservation.getEmail());

        if (null != account) {
            return account;
        }

        @Nonnull
        String displayName = StringUtils.defaultString(StringUtils.defaultIfBlank(reservation.getDestinationWhoisRecord().getRegistrantName(), "Guest"));
        Named named = NameUtil.parse(displayName);

        String password = "password";
        String firstName = Preconditions.checkNotNull(named.getFirstName());
        String lastName = StringUtils.defaultString(named.getFirstName());
        String email = reservation.getEmail();
        String username = DefaultInternetBSClient.getUsernameFromEmail(email);

        ObservableFuture<Map<String, Object>> future = client.createAccount(username, email, password, firstName, lastName, "US");
        Map<String, Object> unchecked = FutureUtils.getUnchecked(future, 30, TimeUnit.SECONDS);

        account = new FreeRegistrationAccount();
        account.setDisplayName(displayName);
        account.setEmail(email);
        account.setUsername(username);
        account.setPassword(password);

        freeRegistrationAccountRepository.save(account);

        return account;
    }

    protected void notifyCustomer(FreeRegistrationAccount account, List<ReservationDomain> domains ) {

    }

    protected void notifyCustomer(FreeRegistrationAccount account, FreeReservation domain) {

    }

    @NotNull
    @Override
    public FreeRegistrationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception {
        return null;
    }

    @Override
    public void register(@NotNull FreeRegistrationAccount account, @NotNull FreeReservation reservation) throws Exception {

    }
}
