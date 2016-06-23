package feedback.register.free.data;

import org.springframework.data.jpa.repository.JpaRepository;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/21/16
 */
public interface FreeRegistrationAccountRepository extends JpaRepository<FreeRegistrationAccount, Long> {

    @Nullable
    FreeRegistrationAccount findByEmail(@NotNull String email);
}
