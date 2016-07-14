package feedback.register.free.services;

import com.topspectrum.data.PageUtils;
import com.topspectrum.mail.EmailTemplate;
import com.topspectrum.mail.TemplatedEmailService;
import com.topspectrum.slack.SlackNotificationBuilder;
import com.topspectrum.slack.SlackService;
import com.topspectrum.template.EmailTemplateService;
import com.topspectrum.template.HandlebarsUtil;
import com.topspectrum.template.Parameters;
import com.topspectrum.util.ConversionUtils;
import com.topspectrum.util.FutureUtils;
import com.topspectrum.web.util.UrlFactory;
import com.zipwhip.concurrent.FakeObservableFuture;
import com.zipwhip.concurrent.ObservableFuture;
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
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.Arrays;

/**
 * @author msmyers
 * @since 7/12/16
 */
@Service
public class SlackApprovalService implements ApprovalService, InitializingBean {

    private static final Logger LOGGER = LoggerFactory.getLogger(SlackApprovalService.class);

    private static final byte[] SECRET_KEY = "f29f47f8-92f6-4c25-a8df-4a66872694e8".getBytes();

    @Autowired
    SlackService slackService;

    @Value("${feedback.free.url}")
    String baseUrl = "dev.free.feedback";

    @Value("${feedback.free.internalCompanyEmail}")
    String internalCompanyEmail;

    @Autowired
    UrlFactory urlFactory;

    @Autowired
    FreeReservationRepository freeReservationRepository;

    @Autowired
    EmailTemplateService emailTemplateService;

    @Autowired
    TemplatedEmailService templatedEmailService;

    @Override
    public void afterPropertiesSet() throws Exception {

    }

    @Override
    @NotNull
    public String generateToken(@NotNull final FreeReservation reservation) {
        return io.jsonwebtoken.Jwts.builder()
                .claim("id", reservation.getId())
                .setIssuer(baseUrl)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    @NotNull
    @Override
    public UriComponentsBuilder approvalUrlBuilder(@NotNull FreeReservation reservation) {
        return urlFactory
                .toBuilder("/api/v1/approval")
                .queryParam("approved", "{approved}")
                .queryParam("token", generateToken(reservation));
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
    public ObservableFuture<Void> requestApproval(@NotNull FreeReservation reservation) throws Exception {
        ObservableFuture<Void> f1 = sendSlack(reservation);
        ObservableFuture<Void> f2 = sendEmail(reservation);

        return FutureUtils.flat(f1, f2);
    }

    protected ObservableFuture<Void> sendSlack(@NotNull final FreeReservation reservation) throws Exception {
        SlackNotificationBuilder builder = slackService.builder();

        UriComponentsBuilder actionUrl = approvalUrlBuilder(reservation);

        ObservableFuture<Void> future = builder
                .username("free.feedback")
                .channel("test-events")
                .text(
                        HandlebarsUtil.inline("{{customerName}} ({{reservation.email}}) needs approval to register <http://www.{{fullDomainName}}|{{fullDomainName}}>\n" +
                                        "\n" +
                                        "This email has {{numberOfPendingReservations}} pending reservations and {{numberOfActiveReservations}} approved reservations.\n" +
                                        "\n" +
                                        "<{{approveUrl}}|Approve>\n" +
                                        "<{{denyUrl}}|Deny>",
                                new Parameters()
                                        .put("reservation", reservation)
                                        .put("numberOfPendingReservations", numberOfPendingReservations(reservation))
                                        .put("numberOfActiveReservations", numberOfActiveReservations(reservation))
                                        .put("customerName", reservation.getDestinationWhoisRecord().getRegistrantName())
                                        .put("fullDomainName", reservation.getDestinationFullDomainName())
                                        .put("approveUrl", actionUrl
                                                .buildAndExpand(Parameters.single("approved", true))
                                                .toUriString())
                                        .put("denyUrl", actionUrl
                                                .buildAndExpand(Parameters.single("approved", true))
                                                .toUriString())
                        ))
                .execute();

        return FutureUtils.wrapFailureObserver(future, LOGGER);
    }

    protected ObservableFuture<Void> sendEmail(@NotNull FreeReservation reservation) throws Exception {
        final EmailTemplate template = emailTemplateService.getTemplateByName("email.operations.confirmation");
        final UriComponentsBuilder actionUrl = approvalUrlBuilder(reservation);

        templatedEmailService.send(
                internalCompanyEmail,
                template,
                new Parameters()
                        .put("reservation", reservation)
                        .put("approveUrl", actionUrl.buildAndExpand(true))
                        .put("denyUrl", actionUrl.buildAndExpand(false)));

        return new FakeObservableFuture<>(this, null);
    }

    protected long numberOfPendingReservations(@NotNull final FreeReservation reservation) {
        return freeReservationRepository.findByEmailAndPurchaseDateIsNullAndDeletedIsFalseAndPendingPolicyApprovalIsTrue(reservation.getEmail(), PageUtils.defaultPageable()).getTotalElements();
    }

    protected long numberOfActiveReservations(@NotNull final FreeReservation reservation) {
        return freeReservationRepository.findByEmailAndPurchaseDateIsNotNullAndDeletedIsFalse(reservation.getEmail(), PageUtils.defaultPageable()).getTotalElements();
    }

}

