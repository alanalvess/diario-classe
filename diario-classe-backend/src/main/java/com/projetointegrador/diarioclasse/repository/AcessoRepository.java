package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Acesso;
import com.projetointegrador.diarioclasse.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    @Query("""
                SELECT a FROM Acesso a
                WHERE (:pessoaId IS NULL OR a.pessoaId = :pessoaId)
                AND (:role IS NULL OR a.role = :role)
                AND (:inicio IS NULL OR a.data >= :inicio)
                AND (:fim IS NULL OR a.data < :fim)
                ORDER BY a.data DESC
            """)
    List<Acesso> buscarComFiltro(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim,
            @Param("pessoaId") Long pessoaId,
            @Param("role") Role role
    );

    @Query("""
                SELECT a FROM Acesso a
                WHERE a.data >= :inicio AND a.data < :fim
            """)
    List<Acesso> findHoje(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("""
                SELECT a FROM Acesso a
                WHERE a.pessoaId = :pessoaId
                AND a.role = :role
                AND a.data >= :inicio AND a.data < :fim
                ORDER BY a.data ASC
            """)
    List<Acesso> findByRoleAndData(
            @Param("pessoaId") Long pessoaId,
            @Param("role") Role role,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );
}
