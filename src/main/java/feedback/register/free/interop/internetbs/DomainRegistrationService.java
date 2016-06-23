package feedback.register.free.interop.internetbs;

import com.topspectrum.registry.WhoisIdentity;
import feedback.register.free.data.FreeRegistrationAccount;
import feedback.register.free.data.FreeReservation;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author msmyers
 * @since 6/21/16
 */
public interface DomainRegistrationService {

    @NotNull
    FreeRegistrationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception;

    void register(@NotNull FreeRegistrationAccount account, @NotNull FreeReservation reservation) throws Exception;

}
