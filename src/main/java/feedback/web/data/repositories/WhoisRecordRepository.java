package feedback.web.data.repositories;

import feedback.web.data.WhoisRecord;
import org.joda.time.DateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by msmyers on 11/5/15.
 */
public interface WhoisRecordRepository extends JpaRepository<WhoisRecord, Long> {

    Page<WhoisRecord> findByFullDomainName(String sourceFullDomainName, Pageable page);

    Page<WhoisRecord> findByFullDomainNameAndCreatedDateAfter(String sourceFullDomainName, DateTime createdDate, Pageable page);

}
