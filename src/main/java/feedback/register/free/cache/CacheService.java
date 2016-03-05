package feedback.register.free.cache;

import org.joda.time.DateTime;
import org.joda.time.Duration;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.concurrent.TimeUnit;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/2/16
 */
public interface CacheService {

    @Nullable
    String get(@NotNull String key) throws Exception;

    @Nullable
    String opt(@NotNull String key);

    void put(@NotNull String key, @Nullable String value);

    void put(@NotNull String key, @Nullable String value, @NotNull DateTime expirationDate);

    void put(@NotNull String key, @NotNull String value, @NotNull Duration duration);

    void put(@NotNull String key, @NotNull String value, long expirationLength, @NotNull TimeUnit expirationUnits);

}
