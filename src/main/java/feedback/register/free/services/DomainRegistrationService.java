package feedback.register.free.services;

import feedback.register.free.data.FreeReservation;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/21/16
 */
public interface DomainRegistrationService {

    boolean isAvailable(@NotNull String fullDomainName);

    @NotNull
    FreeReservation getOrCreateAccount(@NotNull FreeReservation reservation) throws Exception;

    @NotNull
    FreeReservation register(@NotNull FreeReservation reservation) throws Exception;

}
