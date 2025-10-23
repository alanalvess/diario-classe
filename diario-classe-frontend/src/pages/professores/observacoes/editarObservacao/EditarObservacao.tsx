import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, Textarea, TextInput} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import type {Aluno, Disciplina, Observacao, Professor, Turma} from "../../../../models"

import {useAuth} from "../../../../contexts/UseAuth.ts";
import {CategoriaObservacao} from "../../../../enums/CategoriaObservacao.ts";
import {CategoriasAgrupadas} from "../../../../utils/CategoriasAgrupadas.ts";

interface EditarObservacaoProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  observacaoSelecionada?: Observacao | null;
}

function EditarObservacao({
                            open,
                            onClose,
                            onSaved,
                            observacaoSelecionada
                          }: EditarObservacaoProps) {

  const [observacaoAtualizada, setObservacaoAtualizada] = useState<Observacao>(
    {} as Observacao
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [professor, setProfessor] = useState<Professor>();

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarTurmasPorProfessor() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  useEffect(() => {
    if (observacaoAtualizada.turmaId) {
      buscar(`/disciplinas/turma/${observacaoAtualizada.turmaId}`, setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
      buscar(`/alunos/turma/${observacaoAtualizada.turmaId}`, setAlunos, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } else {
      setDisciplinas([]);
      setAlunos([]);
    }
  }, [observacaoAtualizada.turmaId]);


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

  async function editarObservacao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(observacaoAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      await atualizarAtributo(
        `/observacoes/${observacaoSelecionada.id}`, dadosFiltrados, setObservacaoAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Observação atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a observação", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setObservacaoAtualizada({
      ...observacaoAtualizada,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (observacaoSelecionada) {
      setObservacaoAtualizada({...observacaoSelecionada});
    }
  }, [observacaoSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>

          <form className="flex max-w-md flex-col gap-4" onSubmit={editarObservacao}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Observação
              </h2>
            </Card>

            <div className="flex flex-row gap-3">

              <Select
                name="turmaId"
                className="w-full"
                required
                value={observacaoAtualizada.turmaId || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const turmaId = Number(e.target.value);
                  setObservacaoAtualizada({
                    ...observacaoAtualizada,
                    turmaId,
                    disciplinaId: undefined,
                    alunoId: undefined,
                  });
                }}
              >
                <option value="">Selecione a turma</option>
                {turmas.map(turma => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </Select>

              <Select
                name="disciplinaId"
                className="w-full"
                required
                value={observacaoAtualizada.disciplinaId || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setObservacaoAtualizada({
                    ...observacaoAtualizada,
                    disciplinaId: Number(e.target.value),
                  })
                }
              >
                <option value="">Selecione a disciplina</option>

                {disciplinas.map(disciplina => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}

              </Select>
            </div>

            <Select
              name="alunoId"
              required
              value={observacaoAtualizada.alunoId || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setObservacaoAtualizada({
                  ...observacaoAtualizada,
                  alunoId: Number(e.target.value),
                })
              }
            >
              <option value="">Selecione o aluno</option>
              {alunos.map(aluno => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </Select>

            <TextInput
              name="data"
              type="date"
              placeholder="Data da Ocorrência"
              required
              value={
                observacaoAtualizada.data
                  ? new Date(observacaoAtualizada.data).toISOString().split("T")[0]
                  : ""
              }
              onChange={atualizarEstado}
            />

            <Select
              value={observacaoAtualizada.categoria || ""}
              onChange={e =>
                setObservacaoAtualizada({
                  ...observacaoAtualizada,
                  categoria: e.target.value as CategoriaObservacao,
                })
              }
              className="rounded bg-white dark:bg-gray-700 dark:text-gray-100 w-full"
              required
            >
              <option value="">Selecione uma categoria</option>
              {Object.entries(CategoriasAgrupadas).map(([grupo, categorias]) => (
                <optgroup key={grupo} label={grupo}>
                  {categorias.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>



            <Textarea
              name="descricao"
              required
              value={observacaoAtualizada.descricao || ""}
              onChange={atualizarEstado}
            />

            <Button
              type="submit"
              color="green"
              className="cursor-pointer mt-4 flex items-center justify-center gap-2 focus:outline-none focus:ring-0"
              disabled={!professor}>
              {isLoading ? <Spinner size="md" light/> : <span>Salvar Alterações</span>}
            </Button>
          </form>

        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarObservacao;

