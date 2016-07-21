package feedback.register.free.services;

import com.google.common.base.Preconditions;
import com.topspectrum.registry.WhoisIdentity;
import com.topspectrum.util.MorePreconditions;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationAccount;
import feedback.register.free.data.FreeReservationAccountRepository;
import feedback.register.free.data.FreeReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
public abstract class DomainRegistrationServiceBase implements DomainRegistrationService {

    @Autowired
    FreeReservationAccountRepository freeReservationAccountRepository;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Override
    public boolean isAvailable(@NotNull String fullDomainName) {
        return false;
    }

    @NotNull
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FreeReservation getOrCreateAccount(@NotNull FreeReservation reservation) throws Exception {
        reservation = checkExistingAccount(reservation);

        if (null != reservation.getFreeReservationAccount()) {
            // Already has an account.
            return reservation;
        }

        return createAccount(reservation);
    }

    @NotNull
    protected abstract FreeReservation createAccount(@NotNull final FreeReservation reservation) throws Exception;

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

        account = freeReservationAccountRepository.findByEmail(email);

        if (null != account) {
            reservation.setFreeReservationAccount(account);

            return freeReservationRepository.saveAndFlush(reservation);
        }

        return reservation;
    }

    @NotNull
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FreeReservation register(@NotNull FreeReservation reservation) throws Exception {
            reservation
                    .shouldBeApproved()
                    .shouldHaveAccount()
                    .shouldNotBeDeleted()
                    .shouldNotBePurchased();

            final FreeReservationAccount account = Preconditions.checkNotNull(reservation.getFreeReservationAccount());
            final WhoisIdentity identity = Preconditions.checkNotNull(reservation.toWhoisIdentity(), "Must have identity");
            final String fullDomainName = MorePreconditions.checkValidFullDomainName(reservation.getDestinationFullDomainName());

            {
                // Potentially slow web-call.
                Preconditions.checkState(isAvailable(fullDomainName));
            }

            final String transactionId = MorePreconditions.checkNotBlank(executeRegister(reservation), "TransactionId was blank. Did the request fail?");;

            reservation
                    .markPurchased(transactionId);

            return freeReservationRepository.saveAndFlush(reservation);
        }

    @Nullable
    protected abstract String executeRegister(@NotNull final FreeReservation reservation) throws Exception;
}
