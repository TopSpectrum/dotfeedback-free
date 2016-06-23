package feedback.register.free.services;

import feedback.register.free.data.FreeReservation;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/22/16
 */
public interface FreeRegistrationWelcomeService {

    void send(@NotNull FreeReservation reservation) throws Exception;

}
