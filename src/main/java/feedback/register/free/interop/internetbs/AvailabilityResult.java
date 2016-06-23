package feedback.register.free.interop.internetbs;

/**
 * @author msmyers
 * @since 6/20/16
 */
public class AvailabilityResult extends ApiResult {

    private static final long serialVersionUID = 846999279699710080L;

    private final String status;
    private final String domain;
    private final String minregperiod;
    private final String maxregperiod;
    private final String registrarlockallowed;
    private final String privatewhoisallowed;
    private final String realtimeregistration;

    public AvailabilityResult(String transactionId, String status, String domain, String minimumRegistrationPeriod, String maximumRegistrationPeriod, boolean registrarLockAllowed, boolean privateWhoisAllowed, boolean realtimeRegistration) {
        super(transactionId);
        this.status = status;
        this.domain = domain;
        this.minregperiod = minimumRegistrationPeriod;
        this.maxregperiod = maximumRegistrationPeriod;
        this.registrarlockallowed = registrarLockAllowed ? "YES" : "NO";
        this.privatewhoisallowed = privateWhoisAllowed ? "YES" : "NO";
        this.realtimeregistration = realtimeRegistration ? "YES" : "NO";
    }

    //STATUS=AVAILABLE or UNAVAILABLE or FAILURE
    public boolean isAvailable() {
        return "AVAILABLE".equalsIgnoreCase(getStatus());
    }

    public String getStatus() {
        return status;
    }

    public String getDomain() {
        return domain;
    }

    public String getMinimumRegistrationPeriod() {
        return minregperiod;
    }

    public String getMaximumRegistrationPeriod() {
        return maxregperiod;
    }

    public boolean isRegistrarLockAllowed() {
        return "YES".equals(registrarlockallowed);
    }

    public boolean isPrivateWhoisAllowed() {
        return "YES".equals(privatewhoisallowed);
    }

    public boolean isRealtimeRegistration() {
        return "YES".equals(realtimeregistration);
    }
}
