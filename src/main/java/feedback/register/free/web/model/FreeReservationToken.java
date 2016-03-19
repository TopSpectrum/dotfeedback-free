package feedback.register.free.web.model;

import feedback.register.free.data.FreeReservation;

import java.io.Serializable;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */
public class FreeReservationToken implements Serializable {

    private Long id;
    private String sourceFullDomainName;
    private String destinationFullDomainName;
    private String fingerprint;
    private String remoteHost;
    private String name;
    private String street;
    private String city;
    private String state;
    private String postal;
    private String country;
    private String phone;
    private String phoneExt;
    private String fax;
    private String faxExt;
    private String email;
    private String registrar;

    public FreeReservationToken() {

    }

    public FreeReservationToken(FreeReservation reservation) {
        this.id = reservation.getId();
        this.sourceFullDomainName = reservation.getSourceFullDomainName();
        this.destinationFullDomainName = reservation.getDestinationFullDomainName();
        this.fingerprint = reservation.getFingerprint();
        this.remoteHost = reservation.getRemoteHost();
        this.name = reservation.getDestinationWhoisRecord().getAdminName();
        this.street = reservation.getDestinationWhoisRecord().getAdminStreet();
        this.city = reservation.getDestinationWhoisRecord().getAdminCity();
        this.state = reservation.getDestinationWhoisRecord().getAdminState();
        this.postal = reservation.getDestinationWhoisRecord().getAdminPostal();
        this.country = reservation.getDestinationWhoisRecord().getAdminCountry();
        this.phone = reservation.getDestinationWhoisRecord().getAdminPhone();
        this.phoneExt = reservation.getDestinationWhoisRecord().getAdminPhoneExt();
        this.fax = reservation.getDestinationWhoisRecord().getAdminFax();
        this.faxExt = reservation.getDestinationWhoisRecord().getAdminFaxExt();
        this.email = reservation.getDestinationWhoisRecord().getAdminEmail();
        this.registrar = reservation.getDestinationWhoisRecord().getRegistrar();
    }

    public String getRegistrar() {
        return registrar;
    }

    public String getRemoteHost() {
        return remoteHost;
    }

    public void setRemoteHost(String remoteHost) {
        this.remoteHost = remoteHost;
    }

    public String getFingerprint() {
        return fingerprint;
    }

    public void setFingerprint(String fingerprint) {
        this.fingerprint = fingerprint;
    }

    public String getDestinationFullDomainName() {
        return destinationFullDomainName;
    }

    public void setDestinationFullDomainName(String destinationFullDomainName) {
        this.destinationFullDomainName = destinationFullDomainName;
    }

    public String getSourceFullDomainName() {
        return sourceFullDomainName;
    }

    public void setSourceFullDomainName(String sourceFullDomainName) {
        this.sourceFullDomainName = sourceFullDomainName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostal() {
        return postal;
    }

    public void setPostal(String postal) {
        this.postal = postal;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhoneExt() {
        return phoneExt;
    }

    public void setPhoneExt(String phoneExt) {
        this.phoneExt = phoneExt;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getFaxExt() {
        return faxExt;
    }

    public void setFaxExt(String faxExt) {
        this.faxExt = faxExt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
