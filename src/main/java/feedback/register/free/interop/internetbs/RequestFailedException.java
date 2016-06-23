package feedback.register.free.interop.internetbs;

import com.google.common.base.MoreObjects;
import feedback.register.free.interop.internetbs.ErrorResult;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/20/16
 */
public class RequestFailedException extends RuntimeException {

    private static final long serialVersionUID = -4576240569364714931L;

    @NotNull
    private final ErrorResult response;

    public RequestFailedException(@NotNull final ErrorResult response) {
        this.response = response;
    }

    @NotNull
    public ErrorResult getResponse() {
        return response;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("response", response)
                .toString();
    }
}
