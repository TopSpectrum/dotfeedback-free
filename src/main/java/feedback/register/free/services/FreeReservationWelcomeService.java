package feedback.register.free.services;

import feedback.register.free.data.FreeReservation;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/22/16
 */
public interface FreeReservationWelcomeService {

    void send(@NotNull FreeReservation reservation) throws Exception;

    void sendCustomerConfirmationEmail(@NotNull FreeReservation reservation) throws Exception;
    void sendOperationsConfirmationEmail(@NotNull FreeReservation reservation) throws Exception;

    void sendCustomerSuggestionEmail(@NotNull FreeReservation reservation) throws Exception;
    void sendOperationsSuggestionEmail(@NotNull FreeReservation reservation) throws Exception;
    void sendOperationsSuggestionSlackEvent(@NotNull FreeReservation reservation) throws Exception;

    void sendCustomerApprovalEmail(@NotNull FreeReservation reservation) throws Exception;
    void sendOperationsApprovalEmail(@NotNull FreeReservation reservation) throws Exception;
    void sendOperationsApprovalSlackEvent(@NotNull FreeReservation reservation) throws Exception;

}
