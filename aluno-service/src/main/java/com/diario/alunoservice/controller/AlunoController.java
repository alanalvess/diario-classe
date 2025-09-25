package com.diario.alunoservice.controller;

import com.diario.alunoservice.dto.request.AlunoRequest;
import com.diario.alunoservice.dto.response.AlunoResponse;
import com.diario.alunoservice.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<AlunoResponse>> listarTodos() {
        return ResponseEntity.status(HttpStatus.OK).body(alunoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(alunoService.buscarPorId(id));
    }

    @GetMapping("/buscar/{nome}")
    public ResponseEntity<AlunoResponse> buscarPorNome(@PathVariable String nome) {
        return ResponseEntity.status(HttpStatus.OK).body(alunoService.buscarPorNome(nome));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<AlunoResponse> cadastrar(@RequestBody @Valid AlunoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alunoService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AlunoRequest request
    ) {
        request = new AlunoRequest(
                id,
                request.nome(),
                request.matricula(),
                request.turma(),
                request.turno(),
                request.perfilDeRisco()
        );

        AlunoResponse response = alunoService.atualizar(request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizarAtributo(
            @PathVariable Long id,
            @RequestBody Map<String, Object> atributos
    ) {

        AlunoResponse response = alunoService.atualizarAtributo(
                id,
                atributos
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
