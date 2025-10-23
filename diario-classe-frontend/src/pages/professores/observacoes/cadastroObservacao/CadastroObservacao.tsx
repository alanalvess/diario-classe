import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, Textarea, TextInput} from "flowbite-react";

import type {Aluno, Disciplina, Professor, Turma} from "../../../../models";
import {buscar, cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import type {CategoriaObservacao} from "../../../../enums/CategoriaObservacao.ts";
import {CategoriasAgrupadas} from "../../../../utils/CategoriasAgrupadas.ts";

interface CadastroObservacaoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CadastroObservacao({open, onClose, onSaved}: CadastroObservacaoProps) {
  const {usuario} = useAuth();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professor, setProfessor] = useState<Professor>();

  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);

  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  const [isLoading, setIsLoading] = useState(false);

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarTurmasPorProfessor() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      )
      ;
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function buscarDisciplinasPorTurma() {
    if (!turmaSelecionada) return;
    await buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }

  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/alunos/turma/${turmaSelecionada}`, setAlunos, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }, [turmaSelecionada]);

  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);

  useEffect(() => {
    if (professor?.id) {
      buscarTurmasPorProfessor();
    }
  }, [professor]);

  useEffect(() => {
    if (turmaSelecionada) buscarDisciplinasPorTurma();
  }, [turmaSelecionada]);

  async function cadastrarObservacao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turmaSelecionada || !disciplinaSelecionada || !alunoSelecionado || !categoria || !descricao) {
      ToastAlerta("Preencha todos os campos obrigatórios", Toast.Warning);
      return;
    }

    const body = {
      alunoId: alunoSelecionado,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
      professorId: professor.id, // ✅ garante que existe
      descricao,
      categoria,
      data,
    };

    try {
      setIsLoading(true);
      await cadastrar("/observacoes", body, () => {}, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
      ToastAlerta("✅ Observação cadastrada com sucesso", Toast.Success);
      onSaved();
      onClose();
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao cadastrar observação", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setTurmaSelecionada(null);
    setDisciplinaSelecionada(null);
    setAlunoSelecionado(null);
    setCategoria("");
    setDescricao("");
    setData(new Date().toISOString().split("T")[0]);
  }

  useEffect(() => {
    if (open) resetForm();
  }, [open]);


  return (
    <Modal show={open} onClose={onClose} size="lg" popup>
      <ModalHeader/>
      <ModalBody>
        <form className="flex flex-col gap-4" onSubmit={cadastrarObservacao}>
          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Nova Observação
            </h2>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Select
              value={turmaSelecionada ?? ""}
              onChange={e => setTurmaSelecionada(Number(e.target.value))}
              className="rounded flex-1 bg-white dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Selecione a turma</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nome} ({t.anoLetivo})
                </option>
              ))}
            </Select>

            <Select
              value={disciplinaSelecionada ?? ""}
              onChange={e => setDisciplinaSelecionada(Number(e.target.value))}
              className="rounded flex-1 bg-white dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Selecione a disciplina</option>
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </Select>
          </div>

          <Select
            value={alunoSelecionado ?? ""}
            onChange={e => setAlunoSelecionado(Number(e.target.value))}
            className="rounded flex-1 bg-white dark:bg-gray-700 dark:text-gray-100"
            required
          >
            <option value="">Selecione o aluno</option>
            {alunos.map(a => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </Select>

          <TextInput
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="rounded bg-white dark:bg-gray-700 dark:text-gray-100"
          />

          <Select
            value={categoria}
            onChange={e => setCategoria(e.target.value as CategoriaObservacao)}
            className="rounded bg-white dark:bg-gray-700 dark:text-gray-100"
            required
          >
            <option value="">Selecione uma categoria</option>
            {Object.entries(CategoriasAgrupadas).map(([grupo, categorias]) => (
              <optgroup key={grupo} label={grupo}>
                {categorias.map(({value, label}) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>

          <Textarea
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="border rounded  min-h-[100px] bg-white dark:bg-gray-700 dark:text-gray-100"
            required
          />

          <Button
            color="green"
            type="submit"
            className="cursor-pointer mt-4 flex items-center justify-center gap-2 focus:outline-none focus:ring-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="md" light/>
            ) : (
              <span>
                Salvar Observação
              </span>
            )}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}
