package feedback.register.web.controllers.whois.data;

import java.io.Serializable;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */
public class FreeReservationTokenWrapper implements Serializable {

    private FreeReservationToken reservation;

    public FreeReservationTokenWrapper() {

    }

    public FreeReservationTokenWrapper(FreeReservationToken reservation) {
        this.reservation = reservation;
    }

    public FreeReservationToken getReservation() {
        return reservation;
    }

    public void setReservation(FreeReservationToken reservation) {
        this.reservation = reservation;
    }
}