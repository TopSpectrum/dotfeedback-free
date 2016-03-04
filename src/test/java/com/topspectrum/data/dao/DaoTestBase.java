package com.topspectrum.data.dao;

import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.constraints.NotNull;
import java.util.Map;

import static junit.framework.Assert.assertEquals;
import static junit.framework.TestCase.assertNotNull;

/**
 * {discussion here}
 *
 * @author msmyers
 * @version 1.0.0
 * @since 3/4/15
 */
public abstract class DaoTestBase<T> extends ApplicationContextAwareTestBase {

    private final Class<T> clazz;

    protected DaoTestBase(Class<T> clazz) {
        this.clazz = clazz;
    }

    protected T newInstance() throws IllegalAccessException, InstantiationException {
        return clazz.newInstance();
    }

}
