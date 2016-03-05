package feedback.register.free.data;

import org.joda.time.DateTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/4/16
 */
public interface ReferralCodeRepository extends JpaRepository<ReferralCode, Long> {

    List<ReferralCode> findAllByExpirationDateAfterOrExpirationDateIsNull(DateTime expirationDate);

}
