package feedback.register.free.services;

import com.google.common.base.Preconditions;
import com.topspectrum.registry.WhoisIdentity;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservationAccountRepository;
import feedback.register.free.interop.internetbs.DefaultInternetBSClient;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.UUID;

/**
 * @author msmyers
 * @since 6/21/16
 */
@Service
public class MockDomainRegistrationService extends DomainRegistrationServiceBase {

    @Override
    public boolean isAvailable(@NotNull String fullDomainName) {
        return true;
    }

    @Nullable
    @Override
    protected String executeRegister(@NotNull FreeReservation reservation) throws Exception {
        return UUID.randomUUID().toString();
    }

    @NotNull
    @Override
    protected String getVendorId() {
        return "Mock";
    }

    @NotNull
    @Override
    protected FreeReservation executeCreateAccount(@NotNull FreeReservation reservation) throws Exception {
        WhoisIdentity identity = Preconditions.checkNotNull(reservation.toWhoisIdentity());
        FreeReservationAccount account = new FreeReservationAccount();

        account.setDisplayName(identity.getName());
        account.setEmail(identity.getEmail());

        account.setUsername(DefaultInternetBSClient.getUsernameFromEmail(Preconditions.checkNotNull(identity.getEmail())));
        account.setPassword(DefaultInternetBSClient.getTemporaryPassword());

        account.setExternalAccountId(UUID.randomUUID().toString());
        account.setExternalAccountVendor(getVendorId());

        freeReservationAccountRepository.saveAndFlush(account);

        reservation.setFreeReservationAccount(account);

        return freeReservationRepository.saveAndFlush(reservation);
    }

    public FreeReservationAccountRepository getFreeReservationAccountRepository() {
        return freeReservationAccountRepository;
    }

    public void setFreeReservationAccountRepository(FreeReservationAccountRepository freeReservationAccountRepository) {
        this.freeReservationAccountRepository = freeReservationAccountRepository;
    }
}
