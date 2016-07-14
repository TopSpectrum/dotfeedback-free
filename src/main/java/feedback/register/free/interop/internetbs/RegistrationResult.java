package feedback.register.free.interop.internetbs;

import java.util.Map;

/**
 * @author msmyers
 * @since 6/21/16
 */
public class RegistrationResult extends ApiResult {

    private static final long serialVersionUID = 5882493903223595901L;

    private final CreateDomainResult domain;
    private final AvailabilityResult availability;
    private final Map<String, Object> account;

    public RegistrationResult(String transactionId, String status, AvailabilityResult availability, CreateDomainResult domain, Map<String, Object> account) {
        super(transactionId, status);

        this.availability = availability;
        this.domain = domain;
        this.account = account;
    }

    public CreateDomainResult getDomain() {
        return domain;
    }

    public AvailabilityResult getAvailability() {
        return availability;
    }

    public Map<String, Object> getAccount() {
        return account;
    }
}
