package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByAlunoId(Long alunoId);
    List<Nota> findByDisciplinaId(Long disciplinaId);
    List<Nota> findByAvaliacaoId(Long avaliacaoId);
    List<Nota> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);

    Optional<Nota> findByAlunoIdAndDisciplinaIdAndAvaliacaoId(Long alunoId, Long disciplinaId, Long avaliacaoId);

    List<Nota> findByAluno(Aluno aluno);


    // Calcula a média das notas de um aluno
    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.aluno.id = :alunoId")
    Double mediaAluno(@Param("alunoId") Long alunoId);

    // Conta quantas notas acima de um valor (ex: 7 para aprovação) o aluno possui
    @Query("SELECT COUNT(n) FROM Nota n WHERE n.aluno.id = :alunoId AND n.valor >= :notaMinima")
    Long countNotasAcima(@Param("alunoId") Long alunoId, @Param("notaMinima") double notaMinima);

    List<Nota> findByDisciplinaIdAndAlunoTurmaId(Long id, Long turmaId);


}
