package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Acesso;
import com.projetointegrador.diarioclasse.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AcessoRepository extends JpaRepository<Acesso, Long> {


    @Query("""
        SELECT a FROM Acesso a
        WHERE (:data IS NULL OR DATE(a.data) = :data)
        AND (:pessoaId IS NULL OR a.pessoaId = :pessoaId)
        AND (:role IS NULL OR a.role = :role)
        ORDER BY a.data DESC
    """)
    List<Acesso> buscarComFiltro(
            LocalDate data,
            Long pessoaId,
            Role role
    );

    @Query("""
        SELECT a FROM Acesso a
        WHERE DATE(a.data) = :hoje
    """)
    List<Acesso> findHoje(LocalDate hoje);

    @Query("""
        SELECT a FROM Acesso a
        WHERE a.pessoaId = :pessoaId
        AND a.role = :role
        AND DATE(a.data) = :data
        ORDER BY a.data ASC
    """)
    List<Acesso> findByRoleAndData(Long pessoaId, Role role, LocalDate data);
}
