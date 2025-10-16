package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    @Query("SELECT t FROM Turma t JOIN t.professores p WHERE p.id = :professorId")
    List<Turma> findByProfessorId(@Param("professorId") Long professorId);}
