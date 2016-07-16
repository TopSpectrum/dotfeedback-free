package feedback.register.free.services;

import com.topspectrum.util.ConversionUtils;
import feedback.register.free.data.FreeReservation;
import feedback.register.free.data.FreeReservationRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 7/12/16
 */
@Service
public class DefaultApprovalService implements ApprovalService, InitializingBean {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultApprovalService.class);

    private static final byte[] SECRET_KEY = "f29f47f8-92f6-4c25-a8df-4a66872694e8".getBytes();

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Value("${feedback.free.url}")
    String baseUrl = "dev.free.feedback";

    @Override
    public void afterPropertiesSet() throws Exception {

    }

    @Nullable
    @Override
    public FreeReservation getByToken(@Nullable String token) throws Exception {
        Claims parse = Jwts.parser()
                .requireIssuer(baseUrl)
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();

        @Nullable
        Long id = ConversionUtils.optLong(parse.get("id"));

        if (null == id) {
            throw new Exception("Unable to find id: " + token);
        }

        return freeReservationRepository.findOne(id);
    }

    @NotNull
    @Override
    public String generateToken(@NotNull FreeReservation reservation) throws Exception {
        return io.jsonwebtoken.Jwts.builder()
                .claim("id", reservation.getId())
                .setIssuer(baseUrl)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}

