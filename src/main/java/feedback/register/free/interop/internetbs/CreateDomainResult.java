package feedback.register.free.interop.internetbs;

import java.util.Date;

/**
 * @author msmyers
 * @since 6/21/16
 */
public class CreateDomainResult extends ApiResult {

    private static final long serialVersionUID = 5882493903223595901L;

    private String domain;
    private Date domainexpiration;
    private String privatewhois;

    protected CreateDomainResult(String transactionId) {
        super(transactionId);
    }

    public String getDomain() {
        return domain;
    }

    public Date getDomainexpiration() {
        return domainexpiration;
    }

    public String getPrivatewhois() {
        return privatewhois;
    }
}
