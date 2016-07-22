package feedback.register.free.interop.internetbs;

import com.topspectrum.util.StringUtils;

import javax.annotation.Nullable;
import java.io.Serializable;

/**
 * @author msmyers
 * @since 6/20/16
 */
public class ApiResult implements Serializable {

    private static final long serialVersionUID = -2513831618661888916L;

    @Nullable
    private final String transactid;

    @Nullable
    private final String status;

    protected ApiResult(@Nullable final String transactionId, @Nullable final String status) {
        this.transactid = transactionId;
        this.status = status;
    }

    @Nullable
    public String getStatus() {
        return status;
    }

    @Nullable
    public String getTransactionId() {
        return transactid;
    }

    public boolean isFailed() {
        return (StringUtils.equalsIgnoreCase(status, "FAILURE"));
    }

}
