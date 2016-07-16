package feedback.register.free.data;

import com.google.common.base.Preconditions;
import com.topspectrum.data.dto.AbstractDto;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.util.DomainNameUtils;
import com.topspectrum.util.StringUtils;
import com.topspectrum.whois.WhoisRecord;
import com.topspectrum.whois.WhoisRecordAccessor;
import com.topspectrum.whois.WhoisRecordBuilder;
import feedback.web.data.PendingVerificationToken;
import org.apache.commons.lang.BooleanUtils;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

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

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "free_registration_account_id")
    FreeReservationAccount freeReservationAccount;

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

    @Column
    String affiliateCode;

    /**
     * Used in the process of suggestion (the customer sees this 'code').
     * It is NOT used for "pending approval via ops".
     */
    @ManyToOne
    @JoinColumn(name = "pending_verification_token_id")
    PendingVerificationToken pendingVerificationToken;

    /**
     * This is the Timestamp where the customer has decided to purchase the domain.
     * It means intent to purchase. It does not mean approval of purchase.
     *
     * THIS IS STEP 1
     */
    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime checkoutDate;

    /**
     * This is the Timestamp where the customer has received approval to purchase the domain.
     * It does not mean that the domain has been actually purchased yet.
     *
     * THIS IS STEP 2
     */
    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime approvalDate;

    /**
     * This is the Timestamp where the customer has actually been given the domain.
     * It should be considered "taken" at this point.
     *
     * THIS IS STEP 3
     */
    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    DateTime purchaseDate;

    @Column
    private boolean pendingPolicyApproval = false;

    @Column
    private boolean deleted = false;

    @Column
    private boolean suggested = false;

    @Column
    @Nullable
    private Boolean approved = null;

    //region getter/setter
    @Nullable
    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(@Nullable final Boolean approved) {
        this.approved = approved;
    }

    @Nullable
    public FreeReservationAccount getFreeReservationAccount() {
        return freeReservationAccount;
    }

    public void setFreeReservationAccount(@Nullable FreeReservationAccount freeReservationAccount) {
        this.freeReservationAccount = freeReservationAccount;
    }

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

    public DateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(DateTime verifiedDate) {
        this.approvalDate = verifiedDate;
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

    public String getAffiliateCode() {
        return affiliateCode;
    }

    public void setAffiliateCode(String affiliateCode) {
        this.affiliateCode = affiliateCode;
    }

    @Nullable
    public WhoisIdentity toWhoisIdentity(@NotNull final WhoisRecordBuilder.CommonAgent agent) {
        return new WhoisRecordAccessor(getDestinationWhoisRecord(), agent).toWhoisIdentity();
    }

    @Nullable
    public WhoisIdentity toWhoisIdentity() {
        return toWhoisIdentity(WhoisRecordBuilder.CommonAgent.Registrant);
    }

    public boolean isSuggested() {
        return suggested;
    }

    public void setSuggested(boolean suggested) {
        this.suggested = suggested;
    }

    public DateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(DateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    //endregion

    @NotNull
    public FreeReservation shouldBePurchased() {
        shouldBeCheckout();
        shouldBeApproved();

        Preconditions.checkState(isPurchased(), "Should be purchased");

        return this;
    }

    /**
     * Checkout signals the customer intent to purchase.
     *
     * @return
     */
    @NotNull
    public FreeReservation shouldBeCheckout() {
        shouldBeReady();

        Preconditions.checkState(null != getCheckoutDate(), "Must be checked out before calling this.");

        return this;
    }

    @NotNull
    public FreeReservation shouldNotBeCheckout() {
        Preconditions.checkState(null == getCheckoutDate(), "Must not be checkout");

        return this;
    }

    @NotNull
    public FreeReservation shouldNotBeNew() {
        Preconditions.checkState(!isNew(), "Must be saved");

        return this;
    }

    @NotNull
    public FreeReservation shouldNotBePurchased() {
        Preconditions.checkState(null == getPurchaseDate(), "Must not be purchased before calling this.");

        return this;
    }

    public boolean isApproved() {
        return BooleanUtils.isTrue(approved);
    }

    public boolean isPurchased() {
        return null != purchaseDate;
    }

    public boolean isCheckedOut() {
        return null != checkoutDate;
    }

    @NotNull
    public FreeReservation markApproved() {
        return markApproved(true);
    }

    @NotNull
    public FreeReservation markApproved(boolean approved) {
        shouldBeCheckout();
        shouldBePendingApproval();
        shouldLackApprovalDecision();
        shouldLackPendingVerificationToken();

        setPendingPolicyApproval(false);
        setApproved(approved);
        setApprovalDate(DateTime.now());

        return this;
    }

    @NotNull
    public FreeReservation shouldBePendingApproval() {
        shouldBeCheckout();
        shouldLackApprovalDecision();

        Preconditions.checkState(isPendingPolicyApproval(), "Should be pending approval");

        return this;
    }

    @NotNull
    public FreeReservation shouldLackApprovalDecision() {
        Preconditions.checkState(null == approvalDate, "Has approvalDate, should not.");
        Preconditions.checkState(null == approved, "Is having approval");

        return this;
    }

    @NotNull
    public FreeReservation shouldHaveApprovalDecision() {
        Preconditions.checkState(null != approvalDate, "Is lacking approvalDate");
        Preconditions.checkState(null != approved, "Is lacking approval");

        return this;
    }

    @NotNull
    public FreeReservation shouldNotBeApproved() {
        shouldHaveApprovalDecision();

        Preconditions.checkState(!isApproved(), "Should not be approved.");

        return this;
    }

    @NotNull
    public FreeReservation shouldBeApproved() {
        shouldBeCheckout();
        shouldHaveApprovalDecision();

        Preconditions.checkState(isApproved(), "Is not approved.");

        return this;
    }

    @NotNull
    public FreeReservation markSuggested(@NotNull final PendingVerificationToken token) {
        shouldNotBePurchased();

        markApproved();
        setPendingVerificationToken(token);
        setSuggested(true);

        return this;
    }

    @NotNull
    public FreeReservation markCheckout() {
        shouldLackApprovalDecision();
        shouldNotBePurchased();

        setCheckoutDate(DateTime.now());

        return this;
    }

    @NotNull
    public FreeReservation shouldBeSuggested() {
        Preconditions.checkState(isSuggested(), "Should be suggested, was not.");

        return this;
    }

    @NotNull
    public FreeReservation shouldNotBeSuggested() {
        Preconditions.checkState(!isSuggested(), "Should not be suggested, was not.");

        return this;
    }

    @NotNull
    public FreeReservation markPendingApproval() {
        shouldBeCheckout();
        shouldLackApprovalDecision();
        shouldLackPendingVerificationToken();

        this.setPendingPolicyApproval(true);

        return this;
    }

    @NotNull
    public FreeReservation shouldLackPendingVerificationToken() {
        Preconditions.checkState(null == pendingVerificationToken, "Should not have a verification token, but does.");

        return this;
    }

    @NotNull
    public FreeReservation markPurchased() {
        shouldBeApproved();

        this.purchaseDate = DateTime.now();

        return this;
    }

    @NotNull
    public FreeReservation shouldBeReady() {
        shouldNotBeNew();
        shouldNotBeDeleted();

        Preconditions.checkNotNull(getDestinationWhoisRecord());
        Preconditions.checkState(DomainNameUtils.isOurTopLevelDomainName(getDestinationWhoisRecord().getFullDomainName()), "The fullDomainName must be ours: " + getDestinationWhoisRecord().getFullDomainName());
        Preconditions.checkState(DomainNameUtils.isOurTopLevelDomainName(getDestinationFullDomainName()));
        Preconditions.checkState(StringUtils.equals(getDestinationWhoisRecord().getFullDomainName(), getDestinationFullDomainName()));

        return this;
    }

    @NotNull
    public FreeReservation shouldNotBeDeleted() {
        Preconditions.checkState(!isDeleted(), "Should not be deleted");

        return this;
    }
}
