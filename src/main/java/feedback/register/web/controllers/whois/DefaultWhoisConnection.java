package feedback.register.web.controllers.whois;

import org.apache.commons.net.whois.WhoisClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotNull;
import java.net.InetAddress;

/**
 * Created by msmyers on 11/5/15.
 */
public class DefaultWhoisConnection extends WhoisConnectionBase {

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultWhoisConnection.class);
    
    InetAddress host; // whois.iana.org

    @NotNull
    @Override
    protected String execute(String fullDomainName) throws Exception {
        WhoisClient client = new WhoisClient();

        client.setConnectTimeout(20000);
        client.setDefaultTimeout(20000);
//        client.setSoTimeout(20000);
        client.connect(host);

        try {
            String query = client.query(fullDomainName);

            LOGGER.debug("Raw whois: " + query);
            
            return query;
        } finally {
            client.disconnect();
        }
    }

    public InetAddress getHost() {
        return host;
    }

    public void setHost(InetAddress host) {
        this.host = host;
    }
}
