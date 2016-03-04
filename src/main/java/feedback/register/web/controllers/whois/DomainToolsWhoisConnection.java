package feedback.register.web.controllers.whois;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.silvertunnel_ng.netlib.api.NetFactory;
import org.silvertunnel_ng.netlib.api.NetLayer;
import org.silvertunnel_ng.netlib.api.NetLayerIDs;
import org.silvertunnel_ng.netlib.api.NetSocket;
import org.silvertunnel_ng.netlib.api.util.TcpipNetAddress;
import org.silvertunnel_ng.netlib.layer.tor.TorNetLayer;
import org.silvertunnel_ng.netlib.layer.tor.util.Util;
import org.silvertunnel_ng.netlib.util.ByteArrayUtil;
import org.silvertunnel_ng.netlib.util.HttpUtil;
import org.silvertunnel_ng.netlib.util.HttpUtilResponseReceiverThread;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.charset.Charset;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

/**
 * Created by msmyers on 11/6/15.
 */
@Deprecated
public class DomainToolsWhoisConnection extends WhoisConnectionBase {

    private static final Logger LOGGER = LoggerFactory.getLogger(DomainToolsWhoisConnection.class);

    TorNetLayer netLayer;
    AtomicInteger b = new AtomicInteger();

    public DomainToolsWhoisConnection() {
//        // enable redirection (globally for the complete JVM)
//        JvmGlobalUtil.init();
//
//        // select the NetLayer implementation that should be used;
//        //   default is TcpipNetLayer with NetLayerIDs.TCPIP;
//        //   here we set TorNetLayer with NetLayerIDs.TOR:
//        netLayer = (TorNetLayer) NetFactory.getInstance().getNetLayerById(NetLayerIDs.TOR);
//
//        // wait (block the current thread) until this netLayer instance is up and ready and
//        // redirect to the selected netLayer and its corresponding name service implementation
//        JvmGlobalUtil.setNetLayerAndNetAddressNameService(netLayer, true);
    }

    @Override
    protected synchronized String execute(String fullDomainName) throws Exception {
        if (null == netLayer) {
            netLayer = (TorNetLayer) NetFactory.getInstance().getNetLayerById(NetLayerIDs.TOR);
            netLayer.waitUntilReady();
        }

        if (b.incrementAndGet() > 2) {
            netLayer.changeIdentity();
            b.set(0);
        }
        
        // prepare parameters
        try {
            return queryDomainTools(fullDomainName);
        } catch (IllegalStateException e) {
            b.set(5); // force a new IP.
            throw new Exception("Forbidden");
        }
    }

    protected String fetchResponseBody(String fullDomainName) throws IOException {
        long timeoutInMs = 5000;
        TcpipNetAddress httpServerNetAddress = new TcpipNetAddress("whois.domaintools.com", 80);
        String pathOnHttpServer = "/" + fullDomainName;

        return StringUtils.toEncodedString(get(netLayer.createNetSocket(null, null, httpServerNetAddress), httpServerNetAddress, pathOnHttpServer, timeoutInMs), Charset.forName("UTF-8"));
    }

    protected Document fetchDocument(String fullDomainName) throws IOException {
        String responseBody = fetchResponseBody(fullDomainName);
        return Jsoup.parse(responseBody);
    }

    protected String queryDomainTools(String fullDomainName) throws IOException {
        Document document = fetchDocument(fullDomainName);

        String html = document.select(".raw.well.well-sm").html();
        Elements elements = document.select(".raw.well.well-sm a");

        Map<String, String> emails = new HashMap<>();
        for (Element element : elements) {
            TextNode field = (TextNode) element.previousSibling();
            String value = field.getWholeText().replace(":", "").replaceAll("\\p{Z}", " ").replaceAll("\\s", " ").trim();

            String href = element.select("img").attr("src");

            emails.put(value, href);
        }

        // parse it.
        html = html.replace("&nbsp;", " ").replaceAll("<(.*?)>", "").replace("\n\n", "\n");

        // Remove the fields that are empty.
        html = Pattern.compile("(.*?):(\\s*$)", Pattern.MULTILINE).matcher(html).replaceAll("") + "\n";

        for (String fieldName : emails.keySet()) {
            String fieldValue = emails.get(fieldName);

            // Add all the emails
            html += fieldName + ": " + fieldValue + "\n";
        }

        if (StringUtils.isBlank(StringUtils.trimToEmpty(html))) {
            return null;
        }

        return html + ">>> Querried";
    }

    protected String queryIcann(String fullDomainName) throws IOException {
        TcpipNetAddress httpServerNetAddress = new TcpipNetAddress("whois.icann.org", 80);
        String pathOnHttpServer = "/en/lookup?name=" + fullDomainName;
        long timeoutInMs = 5000;
        String responseBody = StringUtils.toEncodedString(get(netLayer.createNetSocket(null, null, httpServerNetAddress), httpServerNetAddress, pathOnHttpServer, timeoutInMs), Charset.forName("UTF-8"));
        Document document = Jsoup.parse(responseBody);

        return document.select(".raw-wrapper .info pre").text();
    }

    /**
     * Try to execute the /httptest/smalltest.php over the provided net socket
     * with a random id.
     *
     * Closes the socket after the test.
     *
     * @param lowerLayerNetSocket
     *            this net socket will be closed inside the method
     * @param idPrefix
     *            only digits and ASCII letters, becomes part of the id sent to
     *            the server
     * @param timeoutInMs
     * @return true=test OK; false=test failed
     * @throws IOException
     */
    public boolean executeSmallTest(NetSocket lowerLayerNetSocket,
                                    String idPrefix, long timeoutInMs) throws IOException
    {
        // generate the id
        final int randomNo = (int) (1000000000 * Math.random());
        final String id = idPrefix + randomNo;

        // communicate with the remote side
        final byte[] httpResponse = get(lowerLayerNetSocket,
                HttpUtil.HTTPTEST_SERVER_NETADDRESS,
                "/httptest/smalltest.php?id=" + id, timeoutInMs);

        // check response
        LOGGER.info("http response body: " + ByteArrayUtil.showAsString(httpResponse));
        final byte[] expectedResponse = ("<response><id>" + id + "</id></response>\n").getBytes(Util.UTF8);
        final boolean testOK = Arrays.equals(expectedResponse, httpResponse);
        if (testOK)
        {
            LOGGER.info("http response body = expected response body");
        }
        else
        {
            LOGGER.info("expected http response body is different: "
                    + ByteArrayUtil.showAsString(expectedResponse));
        }

        lowerLayerNetSocket.close();

        return testOK;
    }

    /**
     * Execute a simple HTTP 1.1 request and read the response.
     *
     * @param lowerNetLayer
     * @param httpServerNetAddress
     * @param pathOnHttpServer
     * @param timeoutInMs
     *            do not wait longer the the specified milliseconds
     * @return
     * @throws IOException
     */
    public byte[] get(final NetLayer lowerNetLayer,
                      final TcpipNetAddress httpServerNetAddress,
                      final String pathOnHttpServer,
                      final long timeoutInMs) throws IOException
    {
        // open network connection
        final NetSocket s = lowerNetLayer.createNetSocket(null, null, httpServerNetAddress);

        return get(s, httpServerNetAddress, pathOnHttpServer, timeoutInMs);
    }

    /**
     * Execute a simple HTTP 1.1 request and provide the response body as
     * InputStream. The response header is not part of the returned InputStream.
     *
     * @param lowerLayerNetSocket
     * @param httpServerNetAddress
     * @param pathOnHttpServer
     * @param timeoutInMs
     *            do not wait longer the the specified milliseconds
     * @return the response body
     * @throws IOException
     */
    public InputStream getReponseBodyInputStream(final NetSocket lowerLayerNetSocket,
                                                 final TcpipNetAddress httpServerNetAddress,
                                                 final String pathOnHttpServer,
                                                 final long timeoutInMs) throws IOException
    {
        final byte[] responseBody = get(lowerLayerNetSocket, httpServerNetAddress, pathOnHttpServer, timeoutInMs);

        return new ByteArrayInputStream(responseBody);
    }

    /**
     * Execute a simple HTTP 1.1 request and read the response.
     *
     * @param lowerLayerNetSocket
     * @param httpServerNetAddress
     * @param pathOnHttpServer
     * @param timeoutInMs
     *            do not wait longer than the specified milliseconds
     * @return the response body
     * @throws IOException
     */
    public static byte[] get(final NetSocket lowerLayerNetSocket,
                             final TcpipNetAddress httpServerNetAddress,
                             final String pathOnHttpServer,
                             final long timeoutInMs) throws IOException
    {
        try
        {
            final String request = "GET " + pathOnHttpServer + " HTTP/1.1\r\n"
                    + "Host: " + getCleanHostname(httpServerNetAddress.getHostnameOrIpaddress()) + "\r\n"
                    + "Connection: close\r\n"
                    + "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n"
//                    + "Accept-Encoding: gzip, deflate, sdch\r\n"
                    + "Accept-Language: en-US,en;q=0.8\r\n"
                    + "Cache-Control: max-age=0\r\n"
                    + "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36\r\n"
                    + "\r\n";
            final byte[] requestBytes = request.getBytes(Util.UTF8);

            // do the work
            return request(lowerLayerNetSocket, httpServerNetAddress, pathOnHttpServer, requestBytes, timeoutInMs);
        }
        catch (final UnsupportedEncodingException e)
        {
            LOGGER.error("this exception may never occur", e);
            throw new IOException(e.toString());
        }
    }
    /**
     * Get a clean hostname.
     *
     * removes the exit-node fingerprint and the .exit from hostname
     *
     * @param hostname the hostname which needs to be cleaned
     * @return the cleaned hostname
     */
    private static String getCleanHostname(final String hostname)
    {
        if (hostname.endsWith(".exit"))
        {
            String tmp = hostname.substring(0, hostname.length() - 5);
            tmp = tmp.substring(0, tmp.lastIndexOf('.'));
            return tmp;
        }
        return hostname;
    }
    /**
     * Execute a simple HTTP 1.1 post and read the response.
     *
     * @param lowerLayerNetSocket
     * @param httpServerNetAddress
     * @param pathOnHttpServer
     * @param timeoutInMs
     *            do not wait longer the the specified milliseconds
     * @return the response body
     * @throws IOException
     */
    public byte[] post(final NetSocket lowerLayerNetSocket,
                       final TcpipNetAddress httpServerNetAddress,
                       final String pathOnHttpServer,
                       final byte[] dataToPost,
                       final long timeoutInMs) throws IOException
    {
        try
        {
            final String request = "POST " + pathOnHttpServer + " HTTP/1.1\r\n"
                    + "Host: " + httpServerNetAddress.getHostnameOrIpaddress()
                    + "\r\n" + "Content-Type: text/plain; charset=utf-8\r\n"
                    + "Content-Length: " + dataToPost.length + "\r\n"
                    // disable keep-alive
                    + "Connection: close\r\n" + "\r\n";
            final byte[] requestBytes1 = request.getBytes(Util.UTF8);
            final byte[] requestBytes = ByteArrayUtil.concatByteArrays(requestBytes1, dataToPost);

            // TODO - remove?:
            LOGGER.info("httpServerNetAddress=" + httpServerNetAddress + " with request=" + new String(requestBytes, Util.UTF8));

            // do the work
            final byte[] response = request(lowerLayerNetSocket,
                    httpServerNetAddress, pathOnHttpServer, requestBytes,
                    timeoutInMs);

            // result
            if (LOGGER.isDebugEnabled())
            {
                try
                {
                    LOGGER.debug("response=" + new String(response, Util.UTF8));
                }
                catch (final Exception e)
                {
                    LOGGER.debug("response={}", Arrays.toString(response));
                }
            }

            return response;
        }
        catch (final UnsupportedEncodingException e)
        {
            LOGGER.error("this exception may never occur", e);
            throw new IOException(e.toString());
        }
    }

    /**
     * Execute a simple HTTP 1.1 get or post request and read the response.
     *
     * @param lowerLayerNetSocket
     * @param httpServerNetAddress
     * @param pathOnHttpServer
     * @param timeoutInMs
     *            do not wait longer the the specified milliseconds
     * @return the response body
     * @throws IOException
     */
    private static byte[] request(final NetSocket lowerLayerNetSocket,
                                  final TcpipNetAddress httpServerNetAddress,
                                  final String pathOnHttpServer,
                                  final byte[] requestBytes,
                                  final long timeoutInMs) throws IOException
    {
        final long startTime = System.currentTimeMillis();

        // open network connection
        final NetSocket s = lowerLayerNetSocket;

        // receive HTTP response
        // (start the extra thread before sending the HTTP request
        // to avoid dead locks in certain circumstances)
        final HttpUtilResponseReceiverThread receiverThread = new HttpUtilResponseReceiverThread(s.getInputStream());

        // send HTTP request
        final OutputStream os = s.getOutputStream();
        try
        {
            LOGGER.info("send HTTP request now: " + ByteArrayUtil.showAsString(requestBytes));
            os.write(requestBytes);
        }
        catch (final UnsupportedEncodingException e)
        {
            LOGGER.error("this exception may never occur", e);
        }
        os.flush();

        receiverThread.start();
        // wait for receiving data
        final long millis = Math.max(100, timeoutInMs - (System.currentTimeMillis() - startTime));
        try
        {
            receiverThread.join(millis);
        }
        catch (final InterruptedException e)
        {
            // to ignore
            LOGGER.debug("got IterruptedException", e.getMessage());
        }

        // read the HTTP response from the other thread
        final byte[] response = receiverThread.readCurrentResultAndStopThread();
        s.close();
        if (LOGGER.isDebugEnabled())
        {
            try
            {
                LOGGER.debug("response=" + new String(response, Util.UTF8));
            }
            catch (final Exception e)
            {
                LOGGER.debug("response=" + response);
            }
        }

        // split response header and body
        int endOfHeaders = response.length;
        int startOfBody = response.length + 1;
        for (int i = 0; i < response.length; i++)
        {
            if (i + 1 < response.length && response[i] == '\n'
                    && response[i + 1] == '\n')
            {
                endOfHeaders = i;
                startOfBody = i + 2;
                break;
            }
            else if (i + 3 < response.length)
            {
                if (response[i] == '\n' && response[i + 1] == '\r'
                        && response[i + 2] == '\n' && response[i + 3] == '\r')
                {
                    endOfHeaders = i;
                    startOfBody = i + 4;
                    break;
                }
                if (response[i] == '\r' && response[i + 1] == '\n'
                        && response[i + 2] == '\r' && response[i + 3] == '\n')
                {
                    endOfHeaders = i;
                    startOfBody = i + 4;
                    break;
                }
            }
        }
        final byte[] responseHeaders = new byte[endOfHeaders];
        if (endOfHeaders > 0)
        {
            System.arraycopy(response, 0, responseHeaders, 0, endOfHeaders);
        }
        final int bodyLen = Math.max(0, response.length - startOfBody);
        byte[] responseBody = new byte[bodyLen];
        if (bodyLen > 0)
        {
            System.arraycopy(response, startOfBody, responseBody, 0, bodyLen);
        }

        // need to handle chunked HTTP response?
        final String responseHeadersAsString = ByteArrayUtil.showAsString(responseHeaders);
        final String CHUNKED_CONTENT_HEADER = "Transfer-Encoding: chunked";
        if (responseHeadersAsString.contains(CHUNKED_CONTENT_HEADER))
        {
            // yes: handle chunked response
            responseBody = decodeChunkedHttpResponse(responseBody);
        }

        // short log of results
        LOGGER.info("received HTTP response header: " + responseHeadersAsString);
        LOGGER.info("received HTTP response body of " + responseBody.length + " bytes");

        if (responseHeadersAsString.contains("HTTP/1.1 403 Forbidden")) {
            throw new IllegalStateException("Banned");
        }

        // result
        return responseBody;
    }

    /**
     * Decode a chunked HTTP response.
     *
     * @param chunkedResponse
     * @return the decoded response
     */
    protected static byte[] decodeChunkedHttpResponse(final byte[] chunkedResponse)
    {
        final List<Byte> result = new ArrayList<Byte>(chunkedResponse.length);
        StringBuffer chunkLenStr = new StringBuffer();
        for (int i = 0; i < chunkedResponse.length;)
        {
            // end of chunk header?
            final int offset = isNewLine(chunkedResponse, i);
            if (offset > 0)
            {
                // yes: end of chunk header
                // convert hex length value to int
                i += offset;
                final int HEX_RADIX = 16;
                int chunkLength = Integer.parseInt(chunkLenStr.toString(),
                        HEX_RADIX);
                if (chunkLength == 0)
                {
                    // found the end
                    break;
                }
                else
                {
                    for (; i < chunkedResponse.length && chunkLength > 0; i++, chunkLength--)
                    {
                        result.add(chunkedResponse[i]);
                    }
                    // prepare collecting the byte of the next chunk header
                    chunkLenStr = new StringBuffer();
                    i += isNewLine(chunkedResponse, i);
                }
            }
            else
            {
                // no: this is part of the chunk header
                chunkLenStr.append((char) chunkedResponse[i++]);
            }
        }

        // end reached: convert result
        final byte[] decodedChunkedHttpResponse = new byte[result.size()];
        for (int i = 0; i < decodedChunkedHttpResponse.length; i++)
        {
            decodedChunkedHttpResponse[i] = result.get(i);
        }
        return decodedChunkedHttpResponse;
    }

    /**
     * Check whether the index points to a 1 or 2 byte long new line.
     *
     * @param data
     * @param index
     * @return 1=1 byte new line; 2=2 byte new lin; 0=no new line in data at
     *         position index
     */
    private static int isNewLine(final byte[] data, final int index)
    {
        if (index + 1 < data.length
                && ((data[index] == '\n' && data[index + 1] == '\r') || data[index] == '\r'
                && data[index + 1] == '\n'))
        {
            // found 2 byte new line
            return 2;
        }
        else if (index < data.length && data[index] == '\n')
        {
            // line
            return 1;
        }
        else
        {
            return 0;
        }

    }


}
