package feedback.register.free.services;

import com.google.common.base.Preconditions;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.util.MorePreconditions;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservationAccountRepository;
import feedback.register.free.data.FreeReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 7/21/16
 */
@Component
public abstract class DomainRegistrationServiceBase implements DomainRegistrationService {

    @Autowired
    FreeReservationAccountRepository freeReservationAccountRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Override
    @Transactional(propagation = Propagation.MANDATORY, transactionManager = "freeTransactionManager")
    public void getOrCreateAccount(@NotNull Long reservationId) throws Exception {
        FreeReservation reservation = Preconditions.checkNotNull(freeReservationRepository.findOne(reservationId), "Must exist: " + reservationId);

        reservation = checkExistingAccount(reservation);

        if (null != reservation.getFreeReservationAccount()) {
            // Already has an account.
            return;
        }

        executeCreateAccount(reservation);
    }

    @NotNull
    protected FreeReservation checkExistingAccount(@NotNull final FreeReservation reservation) {
        @Nullable
        FreeReservationAccount account = reservation.getFreeReservationAccount();

        if (null != account) {
            return reservation;
        }

        @Nonnull
        WhoisIdentity identity = Preconditions.checkNotNull(reservation.toWhoisIdentity());

        @Nonnull
        String email = Preconditions.checkNotNull(identity.getEmail());

        account = freeReservationAccountRepository.findByEmailAndExternalAccountVendor(email, getVendorId());

        if (null != account) {
            reservation.setFreeReservationAccount(account);

            return freeReservationRepository.saveAndFlush(reservation);
        }

        return reservation;
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY, transactionManager = "freeTransactionManager")
    public void register(@NotNull Long reservationId) throws Exception {
        FreeReservation reservation = freeReservationRepository.findOne(reservationId);

        reservation
                    .shouldBeApproved()
                    .shouldHaveAccount()
                    .shouldNotBeDeleted()
                    .shouldNotBePurchased();

            Preconditions.checkNotNull(reservation.getFreeReservationAccount());
            Preconditions.checkNotNull(reservation.toWhoisIdentity(), "Must have identity");

            final String fullDomainName = MorePreconditions.checkValidFullDomainName(reservation.getDestinationFullDomainName());

            {
                // Potentially slow web-call.
                Preconditions.checkState(isAvailable(fullDomainName));
            }

            final String transactionId = MorePreconditions.checkNotBlank(executeRegister(reservation), "TransactionId was blank. Did the request fail?");;

            reservation
                    .markPurchased(transactionId);

            freeReservationRepository.saveAndFlush(reservation);
        }

    @NotNull
    protected abstract FreeReservation executeCreateAccount(@NotNull final FreeReservation reservation) throws Exception;

    @Nullable
    protected abstract String executeRegister(@NotNull final FreeReservation reservation) throws Exception;

    @NotNull
    protected abstract String getVendorId();

}
