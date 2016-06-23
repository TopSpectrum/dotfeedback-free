package feedback.register.free.interop.internetbs;

import com.topspectrum.registry.WhoisIdentity;
import com.zipwhip.concurrent.ObservableFuture;

import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * @author msmyers
 * @since 6/20/16
 */
public interface InternetBSClient {

    @NotNull
    ObservableFuture<CreateDomainResult> registerDomain(@NotNull WhoisIdentity identity, @NotNull String fullDomainName);

    @NotNull
    ObservableFuture<AvailabilityResult> isAvailable(@NotNull String fullDomainName);

    @NotNull
    ObservableFuture<Map<String, Object>> createAccount(String username, String email, String password, String firstName, String lastName, String countryCode);
}
