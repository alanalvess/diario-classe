package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> {
    List<Presenca> findByAlunoId(Long alunoId);
    List<Presenca> findByTurmaId(Long turmaId);
    List<Presenca> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    List<Presenca> findByTurmaIdAndData(Long turmaId, LocalDate data);

    Optional<Presenca> findByAlunoIdAndTurmaIdAndData(Long alunoId, Long turmaId, LocalDate data);

    List<Presenca> findByAluno(Aluno aluno);

    // Conta as presenças de um aluno
    Long countByAlunoIdAndPresenteTrue(Long alunoId);

    // Conta as faltas de um aluno
    Long countByAlunoIdAndPresenteFalse(Long alunoId);

    // Conta total de presenças do aluno
    @Query("SELECT COUNT(p) FROM Presenca p WHERE p.aluno.id = :alunoId")
    Long totalPresencas(@Param("alunoId") Long alunoId);

    // Conta presenças presentes
    @Query("SELECT COUNT(p) FROM Presenca p WHERE p.aluno.id = :alunoId AND p.presente = true")
    Long presencasPresentes(@Param("alunoId") Long alunoId);




}
