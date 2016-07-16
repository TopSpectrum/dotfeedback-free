package feedback.register.free.services;

import feedback.register.free.data.FreeReservation;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 7/12/16
 */
public interface ApprovalService {

    @Nullable
    FreeReservation getByToken(@Nullable String token) throws Exception;

    @NotNull
    String generateToken(@NotNull FreeReservation reservation) throws Exception;

}
