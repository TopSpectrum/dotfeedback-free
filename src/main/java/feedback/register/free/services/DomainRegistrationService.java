package feedback.register.free.services;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/21/16
 */
public interface DomainRegistrationService {

    boolean isAvailable(@NotNull String fullDomainName) throws Exception;

    void getOrCreateAccount(@NotNull Long reservationId) throws Exception;

    void register(@NotNull Long reservationId) throws Exception;

}
