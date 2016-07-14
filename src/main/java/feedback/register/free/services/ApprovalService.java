package feedback.register.free.services;

import com.zipwhip.concurrent.ObservableFuture;
import feedback.register.free.data.FreeReservation;
import org.springframework.web.util.UriComponentsBuilder;

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
    ObservableFuture<Void> requestApproval(@NotNull final FreeReservation reservation) throws Exception;

    @NotNull
    String generateToken(@NotNull final FreeReservation reservation1);

    @NotNull
    UriComponentsBuilder approvalUrlBuilder(@NotNull final FreeReservation reservation);

}
