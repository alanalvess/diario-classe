package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Responsavel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    Optional<Responsavel> findByEmail(String email);
}
