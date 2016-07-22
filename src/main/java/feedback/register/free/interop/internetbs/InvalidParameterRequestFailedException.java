package feedback.register.free.interop.internetbs;

import javax.validation.constraints.NotNull;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 7/21/16
 */
public class InvalidParameterRequestFailedException extends RequestFailedException {

    private final String parameterName;
    private final String parameterValue;

    public InvalidParameterRequestFailedException(@NotNull ErrorResult response, String parameterName, String parameterValue) {
        super(response);

        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
    }

    public String getParameterName() {
        return parameterName;
    }

    public String getParameterValue() {
        return parameterValue;
    }
}
