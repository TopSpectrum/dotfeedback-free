package feedback.register.free.interop.internetbs;

import com.topspectrum.registry.WhoisIdentity;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservationAccountRepository;
import feedback.register.free.data.FreeReservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.*;

/**
 * @author msmyers
 * @since 6/21/16
 */
@Service
public class MockDomainRegistrationService implements DomainRegistrationService {

    @Autowired
    FreeReservationAccountRepository freeReservationAccountRepository;

    @NotNull
    @Override
    public FreeReservationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception {
        FreeReservationAccount account = freeReservationAccountRepository.findByEmail(identity.getEmail());

        if (null == account) {
            account = new FreeReservationAccount();

            account.setDisplayName(identity.getName());
            account.setUsername(DefaultInternetBSClient.getUsernameFromEmail(identity.getEmail()));
            account.setEmail(identity.getEmail());
            account.setExternalAccountId(UUID.randomUUID().toString());
            account.setExternalAccountVendor("Mock");
            account.setPassword(DefaultInternetBSClient.getTemporaryPassword());

            freeReservationAccountRepository.save(account);
        }

        return account;
    }

    @Override
    public void register(@NotNull FreeReservationAccount account, @NotNull FreeReservation reservation) throws Exception {

    }

    public FreeReservationAccountRepository getFreeReservationAccountRepository() {
        return freeReservationAccountRepository;
    }

    public void setFreeReservationAccountRepository(FreeReservationAccountRepository freeReservationAccountRepository) {
        this.freeReservationAccountRepository = freeReservationAccountRepository;
    }
}
