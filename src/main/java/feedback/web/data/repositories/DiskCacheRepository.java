package feedback.web.data.repositories;

import feedback.web.data.DiskCache;
import org.joda.time.DateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/2/16
 */
public interface DiskCacheRepository extends JpaRepository<DiskCache, Long> {

    @NotNull
    Page<DiskCache> findByCacheKey(@NotNull String cacheKey, @NotNull Pageable pageable);

    @Nullable
    DiskCache findByCacheKeyAndExpirationDateAfter(@NotNull String cacheKey, @NotNull DateTime expirationDate);

}
