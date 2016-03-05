package feedback.register.free.cache;

import com.topspectrum.data.PageUtils;
import com.topspectrum.util.DateUtils;
import feedback.register.free.data.DiskCache;
import feedback.register.free.data.DiskCacheRepository;
import org.joda.time.DateTime;
import org.joda.time.Duration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
@Service
public class DiskCacheService implements CacheService {

    @Autowired
    DiskCacheRepository diskCacheRepository;

    @Nullable
    @Override
    public String opt(@NotNull String key) {
        @Nullable
        DiskCache cachedItem = PageUtils.first(diskCacheRepository.findByCacheKey(key, PageUtils.newest()));

        if (null == cachedItem) {
            return null;
        }

        return cachedItem.getValue();
    }

    @Override
    public String get(String key) throws Exception {
        @Nullable
        DiskCache cachedItem = PageUtils.first(diskCacheRepository.findByCacheKey(key, PageUtils.newest()));

        if (null == cachedItem) {
            throw new Exception("Not found: " + key);
        }

        return cachedItem.getValue();
    }

    @Override
    public void put(@NotNull String key, @Nullable String value) {
        put(key, value, 30, TimeUnit.DAYS);
    }

    @Override
    public void put(@NotNull String key, @Nullable String value, @NotNull DateTime expirationDate) {
        final DiskCache diskCache = new DiskCache();

        {
            diskCache.setCacheKey(key);
            diskCache.setValue(value);
            diskCache.setExpirationDate(expirationDate);
        }

        diskCacheRepository.save(diskCache);
    }

    @Override
    public void put(String key, String value, long expirationLength, @NotNull TimeUnit expirationUnits) {
        put(key, value, DateUtils.toDuration(expirationLength, expirationUnits));
    }

    @Override
    public void put(@NotNull String key, @NotNull String value, @NotNull Duration duration) {
        put(key, value, DateUtils.toDateTime(duration));
    }
}
