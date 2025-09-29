package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    Optional<Disciplina> findByCodigo(String codigo);
}
