package feedback.web.data;

import com.topspectrum.data.dto.AbstractDto;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/2/16
 */
@Entity
public class DiskCache extends AbstractDto {

    @Column
    String cacheKey;

    @Column
    String value;

    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime expirationDate;

    public DateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(DateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getCacheKey() {
        return cacheKey;
    }

    public void setCacheKey(String key) {
        this.cacheKey = key;
    }
}
