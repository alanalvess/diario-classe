package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    Optional<Disciplina> findByCodigo(String codigo);

    @Query("SELECT d FROM Disciplina d JOIN d.turmas t WHERE t.id = :turmaId")
    List<Disciplina> findByTurmaId(@Param("turmaId") Long turmaId);

    List<Disciplina> findByTurmasId(Long turmaId);
}
