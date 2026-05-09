package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByMatricula(String matricula);

    List<Aluno> findByTurmaId(Long turmaId);

    @Query("SELECT a FROM Aluno a LEFT JOIN FETCH a.responsaveis")
    List<Aluno> findAllWithResponsaveis();


    Optional<Object> findByEmailIgnoreCase(String email);
}
