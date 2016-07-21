package feedback.register.free.services;

import com.google.common.base.Preconditions;
import com.topspectrum.names.NameUtil;
import com.topspectrum.names.Named;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.util.ConversionUtils;
import com.topspectrum.util.FutureUtils;
import com.topspectrum.util.MorePreconditions;
import com.topspectrum.util.StringUtils;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.interop.internetbs.*;
import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.concurrent.TimeUnit;


/**
 * @author msmyers
 * @since 6/21/16
 */
@Service
public class DefaultDomainRegistrationService extends DomainRegistrationServiceBase {

    @Autowired
    InternetBSClient client;

    @Override
    public boolean isAvailable(@NotNull final String fullDomainName) {
        MorePreconditions.checkValidFullDomainName(fullDomainName);

        return BooleanUtils.isTrue(
                FutureUtils.getUnchecked(
                        FutureUtils.unwrap(
                                client.isAvailable(fullDomainName), (AvailabilityResult result) -> {
                                    if (null == result) {
                                        return false;
                                    }

                                    return result.isAvailable();
                                }), 1, TimeUnit.MINUTES));
    }

    @NotNull
    @Override
    public FreeReservation createAccount(@NotNull FreeReservation reservation) throws Exception {
        Preconditions.checkNotNull(reservation);

        reservation.setFreeReservationAccount(getOrCreateAccount(Preconditions.checkNotNull(reservation.toWhoisIdentity())));

        return freeReservationRepository.saveAndFlush(reservation);
    }

    @Nullable
    @Override
    protected String executeRegister(@NotNull final FreeReservation reservation) {
        final FreeReservationAccount account = Preconditions.checkNotNull(reservation.getFreeReservationAccount());
        final WhoisIdentity identity = Preconditions.checkNotNull(reservation.toWhoisIdentity(), "Must have identity");
        final String fullDomainName = MorePreconditions.checkValidFullDomainName(reservation.getDestinationFullDomainName());
        final CreateDomainResult result = Preconditions.checkNotNull(FutureUtils.getUnchecked(client.registerDomain(identity, fullDomainName), 1, TimeUnit.MINUTES));

        return result.getTransactionId();
    }

    @NotNull
    protected FreeReservationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception {
        Preconditions.checkNotNull(identity, "identity");
        String email = MorePreconditions.checkIsValidEmail(identity.getEmail());

        FreeReservationAccount account = freeReservationAccountRepository.findByEmail(email);

        if (null != account) {
            return account;
        }

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

        account = new FreeReservationAccount();

        account.setExternalAccountVendor(client.getVendorId());
        account.setExternalAccountId(username);
        account.setExternalTransactionId(transactionId);

        account.setDisplayName(displayName);
        account.setEmail(email);
        account.setUsername(username);
        account.setPassword(password);

        freeReservationAccountRepository.saveAndFlush(account);

        return account;
    }
}
