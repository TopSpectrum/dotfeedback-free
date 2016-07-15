DROP TABLE IF EXISTS whois_record;
CREATE TABLE whois_record (
  -- These field names were taken from an external naming source.
  -- They do not correlate with names in our code.
  id                            BIGINT GENERATED BY DEFAULT AS IDENTITY (
  START WITH 1 ) PRIMARY KEY,

  CREATED_DATE                  TIMESTAMP,
  UPDATED_DATE                  TIMESTAMP,
  LAST_MODIFIED_DATE            TIMESTAMP,

  FULL_DOMAIN_NAME              VARCHAR(255) NOT NULL,
  domain_name                   VARCHAR(255) NOT NULL,
  valid_from                    TIMESTAMP,
  valid_until                   TIMESTAMP,
  referral_url                  VARCHAR(255),
  update_date                   TIMESTAMP,
  creation_date                 TIMESTAMP,
  registry_expiry               DATETIME,
  sponsoring_registrar          VARCHAR(50),
  sponsoring_iana               INT,
  domain_status                 VARCHAR(30),
  mocked                        BOOLEAN,

  billing_state                 VARCHAR(20),
  billing_id                    VARCHAR(20),
  billing_phone                 VARCHAR(30),
  billing_phone_ext             VARCHAR(30),
  billing_country               VARCHAR(20),
  billing_name                  VARCHAR(50),
  billing_street                VARCHAR(50),
  billing_city                  VARCHAR(50),
  billing_fax                   VARCHAR(35),
  billing_fax_ext               VARCHAR(10),
  billing_postal                VARCHAR(10),
  billing_organization          VARCHAR(200),

  name_server                   VARCHAR(255),
  whois_server                  VARCHAR(50),

  registrant_name               VARCHAR(50),
  admin_name                    VARCHAR(50),
  tech_name                     VARCHAR(50),
  realregistrant_name           VARCHAR(50),
  realadmin_name                VARCHAR(50),
  realtech_name                 VARCHAR(50),

  billing_email                 VARCHAR(50),
  registrant_email              VARCHAR(50),
  admin_email                   VARCHAR(50),
  tech_email                    VARCHAR(50),
  realregistrant_email          VARCHAR(50),
  realadmin_email               VARCHAR(50),
  realtech_email                VARCHAR(50),

  registrant_organization       VARCHAR(20),
  admin_organization            VARCHAR(20),
  tech_organization             VARCHAR(20),
  realregistrant_organization   VARCHAR(20),
  realadmin_organization        VARCHAR(20),
  realtech_organization         VARCHAR(20),

  domain_id                     VARCHAR(20),
  registrant_id                 VARCHAR(20),
  admin_id                      VARCHAR(20),
  tech_id                       VARCHAR(20),
  realregistrant_id             VARCHAR(20),
  realadmin_id                  VARCHAR(20),
  realtech_id                   VARCHAR(20),

  registrant_street             VARCHAR(50),
  admin_street                  VARCHAR(50),
  tech_street                   VARCHAR(50),
  realregistrant_street         VARCHAR(50),
  realadmin_street              VARCHAR(50),
  realtech_street               VARCHAR(50),

  registrant_city               VARCHAR(20),
  admin_city                    VARCHAR(20),
  tech_city                     VARCHAR(20),
  realregistrant_city           VARCHAR(20),
  realadmin_city                VARCHAR(20),
  realtech_city                 VARCHAR(20),

  registrant_state              VARCHAR(20),
  admin_state                   VARCHAR(20),
  tech_state                    VARCHAR(20),
  realregistrant_state          VARCHAR(20),
  realadmin_state               VARCHAR(20),
  realtech_state                VARCHAR(20),

  registrant_country            VARCHAR(20),
  admin_country                 VARCHAR(20),
  tech_country                  VARCHAR(20),
  realregistrant_country        VARCHAR(20),
  realadmin_country             VARCHAR(20),
  realtech_country              VARCHAR(20),

  registrant_postal             VARCHAR(10),
  admin_postal                  VARCHAR(10),
  tech_postal                   VARCHAR(10),
  realregistrant_postal         VARCHAR(10),
  realadmin_postal              VARCHAR(10),
  realtech_postal               VARCHAR(10),

  registrant_phone              VARCHAR(35),
  admin_phone                   VARCHAR(35),
  tech_phone                    VARCHAR(35),
  realregistrant_phone          VARCHAR(35),
  realadmin_phone               VARCHAR(35),
  realtech_phone                VARCHAR(35),

  registrant_fax                VARCHAR(35),
  admin_fax                     VARCHAR(35),
  tech_fax                      VARCHAR(35),
  realregistrant_fax            VARCHAR(35),
  realadmin_fax                 VARCHAR(35),
  realtech_fax                  VARCHAR(35),

  registrant_phone_ext          VARCHAR(8),
  admin_phone_ext               VARCHAR(8),
  tech_phone_ext                VARCHAR(8),
  realregistrant_phone_ext      VARCHAR(8),
  realadmin_phone_ext           VARCHAR(8),
  realtech_phone_ext            VARCHAR(8),

  registrant_fax_ext            VARCHAR(8),
  admin_fax_ext                 VARCHAR(8),
  tech_fax_ext                  VARCHAR(8),
  realregistrant_fax_ext        VARCHAR(8),
  realadmin_fax_ext             VARCHAR(8),
  realtech_fax_ext              VARCHAR(8),


  abuse_state                   VARCHAR(20),
  abuse_id                      VARCHAR(20),
  abuse_phone                   VARCHAR(35),
  abuse_phone_ext               VARCHAR(35),
  abuse_country                 VARCHAR(20),
  abuse_name                    VARCHAR(50),
  abuse_street                  VARCHAR(50),
  abuse_city                    VARCHAR(50),
  abuse_fax                     VARCHAR(35),
  abuse_fax_ext                 VARCHAR(10),
  abuse_postal                  VARCHAR(10),
  abuse_organization            VARCHAR(200),
  ABUSE_CONTACT_EMAIL           VARCHAR(255),

  COPIED_FROM                   BIGINT,
  DISCOVERY_DATE                TIMESTAMP,
  FAILED                        BOOLEAN,
  IDN_SCRIPT                    VARCHAR(255),
  NOT_FOUND                     BOOLEAN,
  RAW                           VARCHAR(10000),
  REGISTRAR                     VARCHAR(255),
  REGISTRAR_URL                 VARCHAR(255),
  REGISTRAR_ABUSE_CONTACT_EMAIL VARCHAR(255),
  REGISTRAR_ABUSE_CONTACT_PHONE VARCHAR(255),
  REGISTRAR_WHOIS_SERVER        VARCHAR(255),
  REGISTRY_ADMIN_ID             VARCHAR(255),
  REGISTRY_TECH_ID              VARCHAR(255),
  REGISTRY_EXPIRY_DATE          TIMESTAMP,
  SOURCE_LABEL                  VARCHAR(255),
  SOURCE_STRATEGY               VARCHAR(255),
  SOURCE_SUFFIX                 VARCHAR(255),
  SPONSORING_REGISTRAR_IANA_ID  VARCHAR(255),
  UNICODE_HEX                   VARCHAR(255),
  UNICODE_HTML                  VARCHAR(255),

  authinfo                      VARCHAR(128),
  dnssec                        VARCHAR(20)
);
