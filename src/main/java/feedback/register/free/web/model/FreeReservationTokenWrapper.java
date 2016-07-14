package feedback.register.free.web.model;

import java.io.Serializable;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/26/16
 */
public class FreeReservationTokenWrapper implements Serializable {

    private static final long serialVersionUID = 8271115706581368039L;

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