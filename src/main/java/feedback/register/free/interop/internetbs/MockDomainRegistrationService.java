package feedback.register.free.interop.internetbs;

import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.registry.WhoisIdentity;
import feedback.register.free.data.FreeRegistrationAccount;
import feedback.register.free.data.FreeRegistrationAccountRepository;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.services.FreeRegistrationWelcomeService;
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
    FreeRegistrationAccountRepository freeRegistrationAccountRepository;

    @NotNull
    @Override
    public FreeRegistrationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception {
        FreeRegistrationAccount account = freeRegistrationAccountRepository.findByEmail(identity.getEmail());

        if (null == account) {
            account = new FreeRegistrationAccount();

            account.setDisplayName(identity.getName());
            account.setUsername(DefaultInternetBSClient.getUsernameFromEmail(identity.getEmail()));
            account.setEmail(identity.getEmail());
            account.setExternalAccountId(UUID.randomUUID().toString());
            account.setExternalAccountVendor("Mock");
            account.setPassword(DefaultInternetBSClient.getTemporaryPassword());

            freeRegistrationAccountRepository.save(account);
        }

        return account;
    }

    @Override
    public void register(@NotNull FreeRegistrationAccount account, @NotNull FreeReservation reservation) throws Exception {

    }

    public FreeRegistrationAccountRepository getFreeRegistrationAccountRepository() {
        return freeRegistrationAccountRepository;
    }

    public void setFreeRegistrationAccountRepository(FreeRegistrationAccountRepository freeRegistrationAccountRepository) {
        this.freeRegistrationAccountRepository = freeRegistrationAccountRepository;
    }
}
