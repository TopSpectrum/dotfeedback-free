package com.topspectrum.data.dao;

import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.aop.framework.Advised;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.Nullable;
import javax.sql.DataSource;

import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml", "classpath:applicationContext-test.xml"})
@WebAppConfiguration
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@ActiveProfiles("test")
public abstract class ApplicationContextAwareTestBase {

    @Autowired
    DataSource dataSource;

    @Autowired
    JdbcTemplate jdbcTemplate;

    protected MockMvc mockMvc;

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    protected WebApplicationContext wac;

    @Before
    public void __setUp() throws Exception {
        assertNotNull("dataSource null. Check autowiring", dataSource);
        assertNotNull("jdbcTemplate null. Check autowiring", jdbcTemplate);

        this.mockMvc = webAppContextSetup(this.wac).build();
    }

    @After
    public void __tearDown() throws Exception {

    }

    protected <T> T unwrap(@Nullable final Object instance, Class<T> clazz) throws Exception {
        if (null == instance) {
            return null;
        }

        if (AopUtils.isAopProxy(instance) && instance instanceof Advised) {
            Object target = ((Advised) instance).getTargetSource().getTarget();
            return (T) target;
        }

        return (T) instance;
    }

    protected <T> T unwrap(@Nullable final T instance) throws Exception {
        if (null == instance) {
            return null;
        }

        if (AopUtils.isAopProxy(instance) && instance instanceof Advised) {
            Object target = ((Advised) instance).getTargetSource().getTarget();
            return (T) target;
        }

        return (T) instance;
    }
}
