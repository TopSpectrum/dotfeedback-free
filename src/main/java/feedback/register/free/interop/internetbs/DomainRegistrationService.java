package feedback.register.free.interop.internetbs;

import com.topspectrum.registry.WhoisIdentity;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservation;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/21/16
 */
public interface DomainRegistrationService {

    @NotNull
    FreeReservationAccount getOrCreateAccount(@NotNull WhoisIdentity identity) throws Exception;

    void register(@NotNull FreeReservationAccount account, @NotNull FreeReservation reservation) throws Exception;

}
