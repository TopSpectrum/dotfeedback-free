package feedback.register.free.interop.internetbs;

import com.google.common.base.MoreObjects;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/20/16
 */
public class RequestFailedException extends RuntimeException {

    private static final long serialVersionUID = -4576240569364714931L;

    @NotNull
    private final ErrorResult result;

    public RequestFailedException(@NotNull final ErrorResult result) {
        this.result = result;
    }

    @NotNull
    public ErrorResult getResult() {
        return result;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("result", result)
                .toString();
    }
}
