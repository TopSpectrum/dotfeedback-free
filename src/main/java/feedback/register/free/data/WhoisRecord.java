package feedback.register.free.data;

import com.google.common.base.MoreObjects;
import com.topspectrum.data.dto.AbstractDto;
import com.topspectrum.registry.Property;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.util.Date;

/**
 * Created by msmyers on 11/5/15.
 */
@Entity
public class WhoisRecord extends AbstractDto {

    private static final long serialVersionUID = -4818058261247327229L;

    public WhoisRecord() {

    }

    @Column
    private String copiedFrom;

    @Property("Abuse Contact Email")
    @Column
    private String abuseContactEmail;

    @Property("Registrar WHOIS Server")
    private String registrarWhoisServer;

    @Property("Registrar")
    private String registrar;

    @Column
    private String sourceSuffix;

    @Column
    private String sourceLabel;

    @Column
    private String fullDomainName;

    @Column
    private boolean failed;

    @Column
    private boolean notFound;

    @Column
    private Date discoveryDate;

    @Column
    private String raw;

    @Property("Domain Name")
    @Column
    private String domainName;

    @Property("Domain ID")
    @Column
    private String domainId;

    @Property("WHOIS Server")
    @Column
    private String whoisServer;

    @Property("Referral URL")
    @Column
    private String referralUrl;

    @Property("Updated Date")
    @Column
    private String updatedDate;

    @Property("Creation Date")
    @Column
    private String creationDate;

    @Property("Registry Expiry Date")
    @Column
    private String registryExpiryDate;

    @Property("Registry Admin ID")
    private String registryAdminId;

    @Property("Registry Tech ID")
    private String registryTechId;

    @Property("Sponsoring Registrar")
    @Column
    private String sponsoringRegistrar;

    @Property("Sponsoring Registrar IANA ID")
    @Column
    private String sponsoringRegistrarIanaId;

    @Property("Registrar Abuse Contact Email")
    @Column
    private String registrarAbuseContactEmail;

    @Property("Registrar URL")
    @Column
    private String registrarUrl;

    @Property("Registrar Abuse Contact Phone")
    @Column
    private String registrarAbuseContactPhone;

    @Column
    private String sourceStrategy;

    @Property("Domain Status")
    @Column
    private String domainStatus;

    @Property("Registrant ID")
    @Column
    private String registrantId;

    @Property("Registrant Name")
    @Column
    private String registrantName;

    @Property("Registrant Organization")
    @Column
    private String registrantOrganization;

    @Property("Registrant Street")
    @Column
    private String registrantStreet;

    @Property("Registrant City")
    @Column
    private String registrantCity;

    @Property("Registrant State/Province")
    @Column
    private String registrantState;

    @Property("Registrant Postal Code")
    @Column
    private String registrantPostal;

    @Property("Registrant Country")
    @Column
    private String registrantCountry;

    @Property("Registrant Phone")
    @Column
    private String registrantPhone;

    @Property("Registrant Phone Ext")
    @Column
    private String registrantPhoneExt;

    @Property("Registrant Fax")
    @Column
    private String registrantFax;

    @Property("Registrant Fax Ext")
    @Column
    private String registrantFaxExt;

    @Property("Registrant Email")
    @Column
    private String registrantEmail;

    @Property("Admin ID")
    @Column
    private String adminId;

    @Property("Admin Name")
    @Column
    private String adminName;

    @Property("Admin Organization")
    @Column
    private String adminOrganization;

    @Property("Admin Street")
    @Column
    private String adminStreet;

    @Property("Admin City")
    @Column
    private String adminCity;

    @Property("Admin State/Province")
    @Column
    private String adminState;

    @Property("Admin Postal Code")
    @Column
    private String adminPostal;

    @Property("Admin Country")
    @Column
    private String adminCountry;

    @Property("Admin Phone")
    @Column
    private String adminPhone;

    @Property("Admin Phone Ext")
    @Column
    private String adminPhoneExt;

    @Property("Admin Fax")
    @Column
    private String adminFax;

    @Property("Admin Fax Ext")
    @Column
    private String adminFaxExt;

    @Property("Admin Email")
    @Column
    private String adminEmail;

    @Property("Tech ID")
    @Column
    private String techId;

    @Property("Tech Name")
    @Column
    private String techName;

    @Property("Tech Organization")
    @Column
    private String techOrganization;

    @Property("Tech Street")
    @Column
    private String techStreet;

    @Property("Tech City")
    @Column
    private String techCity;

    @Property("Tech State/Province")
    @Column
    private String techState;

    @Property("Tech Postal Code")
    @Column
    private String techPostal;

    @Property("Tech Country")
    @Column
    private String techCountry;

    @Property("Tech Phone")
    @Column
    private String techPhone;

    @Property("Tech Phone Ext")
    @Column
    private String techPhoneExt;

    @Property("Tech Fax")
    @Column
    private String techFax;

    @Property("Tech Fax Ext")
    @Column
    private String techFaxExt;

    @Property("Tech Email")
    @Column
    private String techEmail;

    @Property("Billing ID")
    @Column
    private String billingId;

    @Property("Billing Name")
    @Column
    private String billingName;

    @Property("Billing Organization")
    @Column
    private String billingOrganization;

    @Property("Billing Street")
    @Column
    private String billingStreet;

    @Property("Billing City")
    @Column
    private String billingCity;

    @Property("Billing State/Province")
    @Column
    private String billingState;

    @Property("Billing Postal Code")
    @Column
    private String billingPostal;

    @Property("Billing Country")
    @Column
    private String billingCountry;

    @Property("Billing Phone")
    @Column
    private String billingPhone;

    @Property("Billing Phone Ext")
    @Column
    private String billingPhoneExt;

    @Property("Billing Fax")
    @Column
    private String billingFax;

    @Property("Billing Fax Ext")
    @Column
    private String billingFaxExt;

    @Property("Billing Email")
    @Column
    private String billingEmail;

    @Property("Name Server")
    @Column
    private String nameServer;

    @Property("DNSSEC")
    @Column
    private String dnssec;

    @Property("Unicode Hex")
    @Column
    private String unicodeHex;

    @Property("Unicode HTML")
    @Column
    private String unicodeHtml;

    @Property("IDN Script")
    @Column
    private String idnScript;
    
    public String getSourceStrategy() {
        return sourceStrategy;
    }

    public void setSourceStrategy(String sourceStrategy) {
        this.sourceStrategy = sourceStrategy;
    }

    public String getRegistrarAbuseContactPhone() {
        return registrarAbuseContactPhone;
    }

    public void setRegistrarAbuseContactPhone(String registrarAbuseContactPhone) {
        this.registrarAbuseContactPhone = registrarAbuseContactPhone;
    }

    public String getRegistrarUrl() {
        return registrarUrl;
    }

    public void setRegistrarUrl(String registrarUrl) {
        this.registrarUrl = registrarUrl;
    }

    public String getRegistrarAbuseContactEmail() {
        return registrarAbuseContactEmail;
    }

    public void setRegistrarAbuseContactEmail(String registrarAbuseContactEmail) {
        this.registrarAbuseContactEmail = registrarAbuseContactEmail;
    }

    public String getAbuseContactEmail() {
        return abuseContactEmail;
    }

    public void setAbuseContactEmail(String abuseContactEmail) {
        this.abuseContactEmail = abuseContactEmail;
    }

    public String getIdnScript() {
        return idnScript;
    }

    public void setIdnScript(String idnScript) {
        this.idnScript = idnScript;
    }

    public String getUnicodeHex() {
        return unicodeHex;
    }

    public void setUnicodeHex(String unicodeHex) {
        this.unicodeHex = unicodeHex;
    }

    public String getUnicodeHtml() {
        return unicodeHtml;
    }

    public void setUnicodeHtml(String unicodeHtml) {
        this.unicodeHtml = unicodeHtml;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public String getDomainId() {
        return domainId;
    }

    public void setDomainId(String domainId) {
        this.domainId = domainId;
    }

    public String getWhoisServer() {
        return whoisServer;
    }

    public void setWhoisServer(String whoisServer) {
        this.whoisServer = whoisServer;
    }

    public String getReferralUrl() {
        return referralUrl;
    }

    public void setReferralUrl(String referralUrl) {
        this.referralUrl = referralUrl;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }

    public String getRegistryExpiryDate() {
        return registryExpiryDate;
    }

    public void setRegistryExpiryDate(String registryExpiryDate) {
        this.registryExpiryDate = registryExpiryDate;
    }

    public String getSponsoringRegistrar() {
        return sponsoringRegistrar;
    }

    public void setSponsoringRegistrar(String sponsoringRegistrar) {
        this.sponsoringRegistrar = sponsoringRegistrar;
    }

    public String getSponsoringRegistrarIanaId() {
        return sponsoringRegistrarIanaId;
    }

    public void setSponsoringRegistrarIanaId(String sponsoringRegistrarIanaId) {
        this.sponsoringRegistrarIanaId = sponsoringRegistrarIanaId;
    }

    public String getDomainStatus() {
        return domainStatus;
    }

    public void setDomainStatus(String domainStatus) {
        this.domainStatus = domainStatus;
    }

    public String getRegistrantId() {
        return registrantId;
    }

    public void setRegistrantId(String registrantId) {
        this.registrantId = registrantId;
    }

    public String getRegistrantName() {
        return registrantName;
    }

    public void setRegistrantName(String registrantName) {
        this.registrantName = registrantName;
    }

    public String getRegistrantOrganization() {
        return registrantOrganization;
    }

    public void setRegistrantOrganization(String registrantOrganization) {
        this.registrantOrganization = registrantOrganization;
    }

    public String getRegistrantStreet() {
        return registrantStreet;
    }

    public void setRegistrantStreet(String registrantStreet) {
        this.registrantStreet = registrantStreet;
    }

    public String getRegistrantCity() {
        return registrantCity;
    }

    public void setRegistrantCity(String registrantCity) {
        this.registrantCity = registrantCity;
    }

    public String getRegistrantState() {
        return registrantState;
    }

    public void setRegistrantState(String registrantState) {
        this.registrantState = registrantState;
    }

    public String getRegistrantPostal() {
        return registrantPostal;
    }

    public void setRegistrantPostal(String registrantPostal) {
        this.registrantPostal = registrantPostal;
    }

    public String getRegistrantCountry() {
        return registrantCountry;
    }

    public void setRegistrantCountry(String registrantCountry) {
        this.registrantCountry = registrantCountry;
    }

    public String getRegistrantPhone() {
        return registrantPhone;
    }

    public void setRegistrantPhone(String registrantPhone) {
        this.registrantPhone = registrantPhone;
    }

    public String getRegistrantFax() {
        return registrantFax;
    }

    public void setRegistrantFax(String registrantFax) {
        this.registrantFax = registrantFax;
    }

    public String getRegistrantEmail() {
        return registrantEmail;
    }

    public void setRegistrantEmail(String registrantEmail) {
        this.registrantEmail = registrantEmail;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public String getAdminOrganization() {
        return adminOrganization;
    }

    public void setAdminOrganization(String adminOrganization) {
        this.adminOrganization = adminOrganization;
    }

    public String getAdminStreet() {
        return adminStreet;
    }

    public void setAdminStreet(String adminStreet) {
        this.adminStreet = adminStreet;
    }

    public String getAdminCity() {
        return adminCity;
    }

    public void setAdminCity(String adminCity) {
        this.adminCity = adminCity;
    }

    public String getAdminState() {
        return adminState;
    }

    public void setAdminState(String adminState) {
        this.adminState = adminState;
    }

    public String getAdminPostal() {
        return adminPostal;
    }

    public void setAdminPostal(String adminPostal) {
        this.adminPostal = adminPostal;
    }

    public String getAdminCountry() {
        return adminCountry;
    }

    public void setAdminCountry(String adminCountry) {
        this.adminCountry = adminCountry;
    }

    public String getAdminPhone() {
        return adminPhone;
    }

    public void setAdminPhone(String adminPhone) {
        this.adminPhone = adminPhone;
    }

    public String getAdminFax() {
        return adminFax;
    }

    public void setAdminFax(String adminFax) {
        this.adminFax = adminFax;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public String getTechId() {
        return techId;
    }

    public void setTechId(String techId) {
        this.techId = techId;
    }

    public String getTechName() {
        return techName;
    }

    public void setTechName(String techName) {
        this.techName = techName;
    }

    public String getTechOrganization() {
        return techOrganization;
    }

    public void setTechOrganization(String techOrganization) {
        this.techOrganization = techOrganization;
    }

    public String getTechStreet() {
        return techStreet;
    }

    public void setTechStreet(String techStreet) {
        this.techStreet = techStreet;
    }

    public String getTechCity() {
        return techCity;
    }

    public void setTechCity(String techCity) {
        this.techCity = techCity;
    }

    public String getTechState() {
        return techState;
    }

    public void setTechState(String techState) {
        this.techState = techState;
    }

    public String getTechPostal() {
        return techPostal;
    }

    public void setTechPostal(String techPostal) {
        this.techPostal = techPostal;
    }

    public String getTechCountry() {
        return techCountry;
    }

    public void setTechCountry(String techCountry) {
        this.techCountry = techCountry;
    }

    public String getTechPhone() {
        return techPhone;
    }

    public void setTechPhone(String techPhone) {
        this.techPhone = techPhone;
    }

    public String getTechFax() {
        return techFax;
    }

    public void setTechFax(String techFax) {
        this.techFax = techFax;
    }

    public String getTechEmail() {
        return techEmail;
    }

    public void setTechEmail(String techEmail) {
        this.techEmail = techEmail;
    }

    public String getBillingId() {
        return billingId;
    }

    public void setBillingId(String billingId) {
        this.billingId = billingId;
    }

    public String getBillingName() {
        return billingName;
    }

    public void setBillingName(String billingName) {
        this.billingName = billingName;
    }

    public String getBillingOrganization() {
        return billingOrganization;
    }

    public void setBillingOrganization(String billingOrganization) {
        this.billingOrganization = billingOrganization;
    }

    public String getBillingStreet() {
        return billingStreet;
    }

    public void setBillingStreet(String billingStreet) {
        this.billingStreet = billingStreet;
    }

    public String getBillingCity() {
        return billingCity;
    }

    public void setBillingCity(String billingCity) {
        this.billingCity = billingCity;
    }

    public String getBillingState() {
        return billingState;
    }

    public void setBillingState(String billingState) {
        this.billingState = billingState;
    }

    public String getBillingPostal() {
        return billingPostal;
    }

    public void setBillingPostal(String billingPostal) {
        this.billingPostal = billingPostal;
    }

    public String getBillingCountry() {
        return billingCountry;
    }

    public void setBillingCountry(String billingCountry) {
        this.billingCountry = billingCountry;
    }

    public String getBillingPhone() {
        return billingPhone;
    }

    public void setBillingPhone(String billingPhone) {
        this.billingPhone = billingPhone;
    }

    public String getBillingFax() {
        return billingFax;
    }

    public void setBillingFax(String billingFax) {
        this.billingFax = billingFax;
    }

    public String getBillingEmail() {
        return billingEmail;
    }

    public void setBillingEmail(String billingEmail) {
        this.billingEmail = billingEmail;
    }

    public String getNameServer() {
        return nameServer;
    }

    public void setNameServer(String nameServer) {
        this.nameServer = nameServer;
    }

    public String getDnssec() {
        return dnssec;
    }

    public void setDnssec(String dnssec) {
        this.dnssec = dnssec;
    }

    public Date getDiscoveryDate() {
        return discoveryDate;
    }

    public void setDiscoveryDate(Date discoveryDate) {
        this.discoveryDate = discoveryDate;
    }

    public String getSourceSuffix() {
        return sourceSuffix;
    }

    public void setSourceSuffix(String sourceSuffix) {
        this.sourceSuffix = sourceSuffix;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }

    public void setSourceLabel(String sourceLabel) {
        this.sourceLabel = sourceLabel;
    }

    public String getFullDomainName() {
        return fullDomainName;
    }

    public void setFullDomainName(String sourceFullDomainName) {
        this.fullDomainName = sourceFullDomainName;
    }

    public boolean isFailed() {
        return failed;
    }

    public void setFailed(boolean failed) {
        this.failed = failed;
    }

    public boolean isNotFound() {
        return notFound;
    }

    public void setNotFound(boolean notFound) {
        this.notFound = notFound;
    }

    public String getRegistrantPhoneExt() {
        return registrantPhoneExt;
    }

    public void setRegistrantPhoneExt(String registrantPhoneExt) {
        this.registrantPhoneExt = registrantPhoneExt;
    }

    public String getRegistrantFaxExt() {
        return registrantFaxExt;
    }

    public void setRegistrantFaxExt(String registrantFaxExt) {
        this.registrantFaxExt = registrantFaxExt;
    }

    public String getAdminPhoneExt() {
        return adminPhoneExt;
    }

    public void setAdminPhoneExt(String adminPhoneExt) {
        this.adminPhoneExt = adminPhoneExt;
    }

    public String getAdminFaxExt() {
        return adminFaxExt;
    }

    public void setAdminFaxExt(String adminFaxExt) {
        this.adminFaxExt = adminFaxExt;
    }

    public String getTechPhoneExt() {
        return techPhoneExt;
    }

    public void setTechPhoneExt(String techPhoneExt) {
        this.techPhoneExt = techPhoneExt;
    }

    public String getTechFaxExt() {
        return techFaxExt;
    }

    public void setTechFaxExt(String techFaxExt) {
        this.techFaxExt = techFaxExt;
    }

    public String getBillingPhoneExt() {
        return billingPhoneExt;
    }

    public void setBillingPhoneExt(String billingPhoneExt) {
        this.billingPhoneExt = billingPhoneExt;
    }

    public String getBillingFaxExt() {
        return billingFaxExt;
    }

    public void setBillingFaxExt(String billingFaxExt) {
        this.billingFaxExt = billingFaxExt;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("sourceFullDomainName", fullDomainName)
                .add("failed", failed)
                .add("notFound", notFound)
                .toString();
    }

    public void setCopiedFrom(String copiedFrom) {
        this.copiedFrom = copiedFrom;
    }

    public String getCopiedFrom() {
        return copiedFrom;
    }

    public String getRegistryAdminId() {
        return registryAdminId;
    }

    public void setRegistryAdminId(String registryAdminId) {
        this.registryAdminId = registryAdminId;
    }

    public String getRegistryTechId() {
        return registryTechId;
    }

    public void setRegistryTechId(String registryTechId) {
        this.registryTechId = registryTechId;
    }

    public String getRegistrarWhoisServer() {
        return registrarWhoisServer;
    }

    public void setRegistrarWhoisServer(String registrarWhoisServer) {
        this.registrarWhoisServer = registrarWhoisServer;
    }

    public String getRegistrar() {
        return registrar;
    }

    public void setRegistrar(String registrar) {
        this.registrar = registrar;
    }

    public boolean isReserved() {
        return StringUtils.containsIgnoreCase(this.getAdminOrganization(), "RESERVED");
    }
}