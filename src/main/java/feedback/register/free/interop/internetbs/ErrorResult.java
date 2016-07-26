package feedback.register.free.interop.internetbs;

import com.google.common.base.MoreObjects;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/20/16
 */
public class ErrorResult extends ApiResult {

    private static final long serialVersionUID = -4486015843594962498L;

//    transactid=d2a903a9aadcfeeffae04bb4ff31d6fb
//    status=FAILURE
//    message=Invalid API key and/or Password
//    code=107002

    @NotNull
    private final Integer code;

    @NotNull
    private final String message;

    public ErrorResult(@NotNull Integer code, @NotNull String message, @NotNull String status, @NotNull String transactionId) {
        super(transactionId, status);

        this.code = code;
        this.message = message;
    }

    @NotNull
    public Integer getCode() {
        return code;
    }

    @NotNull
    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("code", code)
                .add("message", message)
                .add("status", getStatus())
                .add("transactionId", getTransactionId())
                .toString();
    }
}
