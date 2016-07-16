package feedback.register.free.interop.internetbs;

import com.google.common.base.Preconditions;
import com.topspectrum.feedback.register.data.ReservationDomain;
import com.topspectrum.names.NameUtil;
import com.topspectrum.names.Named;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.test.TestUtil;
import com.topspectrum.util.ConversionUtils;
import com.topspectrum.util.FutureUtils;
import com.topspectrum.util.StringUtils;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservationAccountRepository;
import feedback.register.free.data.FreeReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nonnull;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.concurrent.TimeUnit;


/**
 * @author msmyers
 * @since 6/21/16
 */
@Service
public class DefaultDomainRegistrationService implements DomainRegistrationService {

    @Autowired
    FreeReservationAccountRepository freeReservationAccountRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    InternetBSClient client;

    @NotNull
    @Override
    public FreeReservationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception {
        Preconditions.checkNotNull(identity, "identity");
        String email = TestUtil.randomCustomerEmailAddress();
//        String email = Preconditions.checkNotNull(identity.getEmail(), "email");

//        FreeReservationAccount account = freeReservationAccountRepository.findByEmail(email);
//
//        if (null != account) {
//            return account;
//        }

        @Nonnull
        String displayName = StringUtils.defaultString(StringUtils.defaultIfBlank(identity.getName(), "Guest"));
        Named named = NameUtil.parse(displayName);

        String password = "password";
        String firstName = Preconditions.checkNotNull(named.getFirstName());
        String lastName = StringUtils.defaultString(named.getFirstName());
        String username = DefaultInternetBSClient.getUsernameFromEmail(email);

        ApiResult result = Preconditions.checkNotNull(
                FutureUtils.getUnchecked(
                        client.createAccount(username, email, password, firstName, lastName, "US")
                        , 30, TimeUnit.SECONDS));

        @Nonnull
        String transactionId = ConversionUtils.defaultString(ConversionUtils.toString(result.getTransactionId()));

        FreeReservationAccount account = new FreeReservationAccount();

        account.setExternalAccountVendor(client.getVendorId());
        account.setExternalAccountId(username);
        account.setExternalTransactionId(transactionId);

        account.setDisplayName(displayName);
        account.setEmail(email);
        account.setUsername(username);
        account.setPassword(password);

        freeReservationAccountRepository.save(account);

        return account;
    }

    protected void notifyCustomer(FreeReservationAccount account, List<ReservationDomain> domains) {

    }

    protected void notifyCustomer(FreeReservationAccount account, FreeReservation domain) {

    }

    @Override
    public void register(@NotNull FreeReservationAccount account, @NotNull FreeReservation reservation) throws Exception {

    }
}
