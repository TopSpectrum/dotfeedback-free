package feedback.register.free.data;

import com.topspectrum.data.dto.AbstractDto;
import feedback.web.data.PendingVerificationToken;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.annotation.Nullable;
import javax.persistence.*;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */
public class FreeReservation extends AbstractDto {

    private static final long serialVersionUID = -9001493940550251340L;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_whois_record_id")
    WhoisRecord destinationWhoisRecord;

    @Nullable
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "source_whois_record_id")
    WhoisRecord sourceWhoisRecord;

    @Column
    String sourceFullDomainName;

    @Column
    String destinationFullDomainName;

    @Column
    String email;

    @Column
    String fingerprint;

    @Column
    String remoteHost;

    @Column
    String referralCode;

    @ManyToOne
    @JoinColumn(name = "pending_verification_token_id")
    PendingVerificationToken pendingVerificationToken;

    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime verifiedDate;

    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime checkoutDate;

    @Column
    private boolean pendingPolicyApproval;

    @Column
    private boolean deleted;

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    @Nullable
    public WhoisRecord getSourceWhoisRecord() {
        return sourceWhoisRecord;
    }

    public void setSourceWhoisRecord(@Nullable WhoisRecord sourceWhoisRecord) {
        this.sourceWhoisRecord = sourceWhoisRecord;
    }

    public DateTime getCheckoutDate() {
        return checkoutDate;
    }

    public void setCheckoutDate(DateTime checkoutDate) {
        this.checkoutDate = checkoutDate;
    }

    public WhoisRecord getDestinationWhoisRecord() {
        return destinationWhoisRecord;
    }

    public void setDestinationWhoisRecord(WhoisRecord whoisRecord) {
        this.destinationWhoisRecord = whoisRecord;
    }

    public String getSourceFullDomainName() {
        return sourceFullDomainName;
    }

    public void setSourceFullDomainName(String sourceFullDomainName) {
        this.sourceFullDomainName = sourceFullDomainName;
    }

    public String getDestinationFullDomainName() {
        return destinationFullDomainName;
    }

    public void setDestinationFullDomainName(String destinationFullDomainName) {
        this.destinationFullDomainName = destinationFullDomainName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFingerprint() {
        return fingerprint;
    }

    public void setFingerprint(String fingerprint) {
        this.fingerprint = fingerprint;
    }

    public String getRemoteHost() {
        return remoteHost;
    }

    public void setRemoteHost(String remoteHost) {
        this.remoteHost = remoteHost;
    }

    public PendingVerificationToken getPendingVerificationToken() {
        return pendingVerificationToken;
    }

    public void setPendingVerificationToken(PendingVerificationToken pendingVerificationToken) {
        this.pendingVerificationToken = pendingVerificationToken;
    }

    public DateTime getVerifiedDate() {
        return verifiedDate;
    }

    public void setVerifiedDate(DateTime verifiedDate) {
        this.verifiedDate = verifiedDate;
    }

    public void setPendingPolicyApproval(boolean pendingPolicyApproval) {
        this.pendingPolicyApproval = pendingPolicyApproval;
    }

    public boolean isPendingPolicyApproval() {
        return pendingPolicyApproval;
    }
    
    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }
}
