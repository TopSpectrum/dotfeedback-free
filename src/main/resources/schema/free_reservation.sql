DROP TABLE IF EXISTS free_reservation;
CREATE TABLE free_reservation (

  id                                     BIGINT GENERATED BY DEFAULT AS IDENTITY (
  START WITH 0 ) PRIMARY KEY,

  created_date                           TIMESTAMP NOT NULL,
  last_modified_date                     TIMESTAMP NOT NULL,

  destination_whois_record_id            BIGINT,
  source_whois_record_id                 BIGINT,

  source_full_domain_name                VARCHAR(255),
  destination_full_domain_name           VARCHAR(255),

  email                                  VARCHAR(255),
  fingerprint                            VARCHAR(255),
  remote_host                            VARCHAR(255),
  referral_code                          VARCHAR(255),
  affiliate_code                         VARCHAR(255),
  pending_verification_token_id          BIGINT,

  verification_date                      TIMESTAMP,
  approval_date                          TIMESTAMP,
  checkout_date                          TIMESTAMP,
  purchase_date                          TIMESTAMP,

  deleted                                BOOLEAN,
  suggested                              BOOLEAN,
  approved                               BOOLEAN,
  pending_policy_approval                BOOLEAN,

  free_registration_account_id           BIGINT,
  external_account_vendor_transaction_id VARCHAR(255)

);