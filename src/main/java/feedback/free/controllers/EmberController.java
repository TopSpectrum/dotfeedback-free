package feedback.free.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 2/29/16
 */
@Controller
public class EmberController {

    @RequestMapping("/ember")
    public ModelAndView ember3() {
        return new ModelAndView("index");
    }

}
