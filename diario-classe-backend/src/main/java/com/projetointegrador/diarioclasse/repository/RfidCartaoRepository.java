package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Rfid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RfidCartaoRepository extends JpaRepository<Rfid, Long> {
    Optional<Rfid> findByUidIgnoreCase(String uid);
    Optional<Rfid> findByEmailIgnoreCase(String email);
}
