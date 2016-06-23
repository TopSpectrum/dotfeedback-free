package feedback.register.free.interop.internetbs;

import com.topspectrum.util.ConversionUtils;

import java.util.Set;

/**
 * @author msmyers
 * @since 6/21/16
 */
public class ListDomainsResult extends ApiResult {

    private static final long serialVersionUID = 5882493903223595901L;

    private int domaincount;
    private String[] domain;

    protected ListDomainsResult(String transactionId) {
        super(transactionId);
    }

    public int getDomainCount() {
        return domaincount;
    }

    public Set<String> getDomains() {
        return ConversionUtils.toSet(domain);
    }
}
