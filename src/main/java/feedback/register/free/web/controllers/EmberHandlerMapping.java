package feedback.register.free.web.controllers;

import org.apache.commons.lang3.StringUtils;
import org.springframework.core.Ordered;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.HandlerMapping;

import javax.annotation.Nullable;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/29/16
 */
public class EmberHandlerMapping implements HandlerMapping, Ordered {

    @Override
    public HandlerExecutionChain getHandler(@Nullable final HttpServletRequest request) throws Exception {
        if (null == request) {
            return null;
        }

        if (StringUtils.startsWithIgnoreCase(request.getRequestURI(), "/api/v1")) {
            return null;
        }

        return new HandlerExecutionChain(new InternalRedirectHandler());
    }

    private static class InternalRedirectHandler implements HttpRequestHandler {

        private InternalRedirectHandler() {

        }

        @Override
        public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            request.getRequestDispatcher("/ember").forward(request, response);
        }
    }

    @Override
    public int getOrder() {
        return Integer.MAX_VALUE;
    }

}
