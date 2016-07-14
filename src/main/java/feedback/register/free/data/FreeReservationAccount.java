package feedback.register.free.data;

import com.topspectrum.data.dto.AbstractDto;
import com.topspectrum.names.Name;
import com.topspectrum.names.NameUtil;
import com.topspectrum.names.Named;
import com.topspectrum.util.StringUtils;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * @author msmyers
 * @since 6/21/16
 */
@Entity
public class FreeReservationAccount extends AbstractDto {

    private static final long serialVersionUID = -7310420902685554503L;

    @Column
    private String externalAccountVendor;

    @Column
    private String externalAccountId;

    @Column
    private String username;

    @Column
    private String email;

    @Column
    private String password;

    @Column
    private String displayName;

    @Column
    private String firstName;

    @Column
    private String lastName;
    private String externalTransactionId;

    public String getExternalAccountVendor() {
        return externalAccountVendor;
    }

    public void setExternalAccountVendor(String externalAccountVendor) {
        this.externalAccountVendor = externalAccountVendor;
    }

    public String getExternalAccountId() {
        return externalAccountId;
    }

    public void setExternalAccountId(String externalAccountId) {
        this.externalAccountId = externalAccountId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = StringUtils.defaultIfBlank(displayName, "Guest");

        Named named = NameUtil.parse(this.displayName);

        setFirstName(StringUtils.defaultString(named.getFirstName(), "Guest"));
        setLastName(StringUtils.defaultString(named.getLastName()));
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setExternalTransactionId(String externalTransactionId) {
        this.externalTransactionId = externalTransactionId;
    }

    public String getExternalTransactionId() {
        return externalTransactionId;
    }
}
