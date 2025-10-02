package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Observacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObservacaoRepository extends JpaRepository<Observacao, Long> {
    List<Observacao> findByAlunoId(Long alunoId);
//    List<Observacao> findByProfessorId(Long professorId);
}
