DROP TABLE IF EXISTS reservation_account_domain;
CREATE TABLE reservation_account_domain (

  id                  BIGINT GENERATED BY DEFAULT AS IDENTITY (
  START WITH 0 ) PRIMARY KEY,

  created_date        TIMESTAMP NOT NULL,
  last_modified_date  TIMESTAMP NOT NULL,

  parent_id           BIGINT,

  full_domain_name    VARCHAR(255),

  free_reservation_id BIGINT

);