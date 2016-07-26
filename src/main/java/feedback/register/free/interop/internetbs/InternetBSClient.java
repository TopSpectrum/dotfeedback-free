package feedback.register.free.interop.internetbs;

import com.topspectrum.registry.WhoisIdentity;
import com.zipwhip.concurrent.ObservableFuture;

import javax.validation.constraints.NotNull;

/**
 * @author msmyers
 * @since 6/20/16
 */
public interface InternetBSClient {

    @NotNull
    ObservableFuture<CreateDomainResult> registerDomain(@NotNull WhoisIdentity identity, @NotNull String fullDomainName);

    @NotNull
    ObservableFuture<ApiResult> assignDomain(@NotNull String username, @NotNull String fullDomainName);

    @NotNull
    ObservableFuture<AvailabilityResult> isAvailable(@NotNull String fullDomainName);

    @NotNull
    ObservableFuture<ApiResult> createAccount(@NotNull String username, @NotNull String email, @NotNull String password, @NotNull String firstName, @NotNull String lastName, @NotNull String countryCode);

    @NotNull
    String getVendorId();

}