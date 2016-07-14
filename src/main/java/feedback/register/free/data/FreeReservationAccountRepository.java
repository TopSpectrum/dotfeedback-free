package feedback.register.free.data;

import org.springframework.data.jpa.repository.JpaRepository;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/21/16
 */
public interface FreeReservationAccountRepository extends JpaRepository<FreeReservationAccount, Long> {

    @Nullable
    FreeReservationAccount findByEmail(@NotNull String email);
}
