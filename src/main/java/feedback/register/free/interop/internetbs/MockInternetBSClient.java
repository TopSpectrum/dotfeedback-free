package feedback.register.free.interop.internetbs;

import com.topspectrum.registry.WhoisIdentity;
import com.zipwhip.concurrent.FakeObservableFuture;
import com.zipwhip.concurrent.ObservableFuture;

import javax.validation.constraints.NotNull;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 7/25/16
 */
public class MockInternetBSClient implements InternetBSClient {

    @NotNull
    @Override
    public ObservableFuture<CreateDomainResult> registerDomain(@NotNull WhoisIdentity identity, @NotNull String fullDomainName) {
        return new FakeObservableFuture<>(this, null);
    }

    @NotNull
    @Override
    public ObservableFuture<ApiResult> assignDomain(@NotNull String username, @NotNull String fullDomainName) {
        return new FakeObservableFuture<>(this, null);
    }

    @NotNull
    @Override
    public ObservableFuture<AvailabilityResult> isAvailable(@NotNull String fullDomainName) {
        return new FakeObservableFuture<>(this, null);
    }

    @NotNull
    @Override
    public ObservableFuture<ApiResult> createAccount(@NotNull String username, @NotNull String email, @NotNull String password, @NotNull String firstName, @NotNull String lastName, @NotNull String countryCode) {
        return new FakeObservableFuture<>(this, null);
    }

    @NotNull
    @Override
    public String getVendorId() {
        return "Mock";
    }
}
