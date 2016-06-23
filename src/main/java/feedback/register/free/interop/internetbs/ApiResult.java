package feedback.register.free.interop.internetbs;

import java.io.Serializable;

/**
 * @author msmyers
 * @since 6/20/16
 */
public abstract class ApiResult implements Serializable {

    private static final long serialVersionUID = -2513831618661888916L;

    private final String transactid;

    protected ApiResult(String transactionId) {
        this.transactid = transactionId;
    }

    public String getTransactionId() {
        return transactid;
    }

}
