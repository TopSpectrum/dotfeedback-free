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
 * @since 3/3/16
 */
public class NullCacheService implements CacheService {

    @Nullable
    @Override
    public String get(@NotNull String key) throws Exception {
        throw new Exception("Not found");
    }

    @Nullable
    @Override
    public String opt(@NotNull String key) {
        return null;
    }

    @Override
    public void put(@NotNull String key, @Nullable String value) {

    }

    @Override
    public void put(@NotNull String key, @Nullable String value, @NotNull DateTime expirationDate) {

    }

    @Override
    public void put(@NotNull String key, @NotNull String value, @NotNull Duration duration) {

    }

    @Override
    public void put(@NotNull String key, @NotNull String value, long expirationLength, @NotNull TimeUnit expirationUnits) {

    }
}
