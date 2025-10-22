import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Disciplina, Professor, Turma} from "../../../../models"
import {useAuth} from "../../../../contexts/UseAuth.ts";
import MultiSelectDropdown from "../../../../components/form/MultipleSelectDropdown.tsx";

interface EditarTurmaProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  turmaSelecionada?: Turma | null;
}

function EditarTurma({
                       open,
                       onClose,
                       onSaved,
                       turmaSelecionada
                     }: EditarTurmaProps) {

  const [turmaAtualizada, setTurmaAtualizada] = useState<Turma>({} as Turma);
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [professorIdsSelecionados, setProfessorIdsSelecionados] = useState<number[]>([]);
  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);

  async function editarTurma(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dadosFiltrados = Object.fromEntries(
        Object.entries(turmaAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      dadosFiltrados.professorIds = professorIdsSelecionados;
      dadosFiltrados.disciplinaIds = disciplinaIdsSelecionadas;

      await atualizarAtributo(
        `/turmas/${turmaSelecionada.id}`, dadosFiltrados, setTurmaAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Turma atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a turma", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setTurmaAtualizada({
      ...turmaAtualizada,
      [e.target.name]: e.target.value,
    });
  }

  async function buscarProfessores() {
    try {
      await buscar("/professores", setProfessores, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  }

  async function buscarDisciplinas() {
    try {
      await buscar("/disciplinas", setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  }

  useEffect(() => {
    if (open) {
      buscarProfessores();
      buscarDisciplinas();
    }
  }, [open]);

  useEffect(() => {
    if (turmaSelecionada) {
      setTurmaAtualizada({...turmaSelecionada});

      setProfessorIdsSelecionados(turmaSelecionada.professorIds || []);
      setDisciplinaIdsSelecionadas(turmaSelecionada.disciplinaIds || []);
    }
  }, [turmaSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarTurma}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Turma
              </h2>
            </Card>

            <TextInput
              name="nome"
              placeholder="Nome"
              required
              value={turmaAtualizada.nome || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              name="anoLetivo"
              placeholder="Ano Letivo"
              required
              value={turmaAtualizada.anoLetivo || ""}
              onChange={atualizarEstado}
            />

            <div>
              <Label>Professores</Label>
              <MultiSelectDropdown
                titulo="Professores"
                opcoes={professores}
                selecionados={professorIdsSelecionados}
                setSelecionados={setProfessorIdsSelecionados}
              />
            </div>

            <div>
              <Label>Disciplinas</Label>
              <MultiSelectDropdown
                titulo="Disciplinas"
                opcoes={disciplinas}
                selecionados={disciplinaIdsSelecionadas}
                setSelecionados={setDisciplinaIdsSelecionadas}
              />
            </div>

            <Button
              type="submit"
              color="green"
              className='cursor-pointer mt-6 focus:outline-none focus:ring-0'
            >
              {isLoading ? <Spinner size="md" light/> : <span>Salvar Alterações</span>}
            </Button>
          </form>

        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarTurma;

