package com.projetointegrador.diarioclasse.entity;

import com.projetointegrador.diarioclasse.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@Data
//@Entity
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@Table(name = "tb_rfids")
//public class Rfid {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true, nullable = false)
//    private String uid;
//
//    @Column(nullable = false)
//    private Long pessoaId;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private Role role;
//
//    @Builder.Default
//    private Boolean ativo = true;
//}
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_rfids")
public class Rfid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String uid;

    @Column(nullable = false)
    private String email; // Chave lógica que liga todas as tabelas

    @Builder.Default
    private Boolean ativo = true;
}