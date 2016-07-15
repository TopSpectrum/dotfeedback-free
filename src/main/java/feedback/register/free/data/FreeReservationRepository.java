package feedback.register.free.data;

import com.topspectrum.whois.WhoisRecord;
import feedback.web.data.PendingVerificationToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */
public interface FreeReservationRepository extends JpaRepository<FreeReservation, Long> {

    FreeReservation findByPendingVerificationToken(PendingVerificationToken pendingVerificationToken);

    Page<FreeReservation> findByEmailAndCheckoutDateIsNullAndDeletedIsFalse(String email, Pageable pageable);

    Page<FreeReservation> findByEmailAndPurchaseDateIsNullAndDeletedIsFalseAndPendingPolicyApprovalIsTrue(String email, Pageable pageable);

    Page<FreeReservation> findByEmailAndPurchaseDateIsNotNullAndDeletedIsFalse(String email, Pageable pageable);

    List<FreeReservation> findByDestinationWhoisRecord(@NotNull final WhoisRecord record);

}
