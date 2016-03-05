package feedback.register.free.data;

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
 * @since 3/4/16
 */
@Entity
public class ReferralCode extends AbstractDto {

    @Column
    String code;

    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime expirationDate;

    public DateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(DateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
