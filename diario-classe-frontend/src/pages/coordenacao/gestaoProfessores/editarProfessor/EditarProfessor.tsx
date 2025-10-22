import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import type {Disciplina, Professor, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import MultiSelectDropdown from "../../../../components/form/MultipleSelectDropdown.tsx";

interface EditarProfessorProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  professorSelecionado?: Professor | null;
}

function EditarProfessor({
                           open,
                           onClose,
                           onSaved,
                           professorSelecionado
                         }: EditarProfessorProps) {

  const [professorAtualizado, setProfessorAtualizado] = useState<Professor>({} as Professor);
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [disciplinas, setdisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);
  const [turmaIdsSelecionadas, setTurmaIdsSelecionadas] = useState<number[]>([]);

  async function editarProfessor(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dadosFiltrados = Object.fromEntries(
        Object.entries(professorAtualizado).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      dadosFiltrados.disciplinaIds = disciplinaIdsSelecionadas;
      dadosFiltrados.turmaIds = turmaIdsSelecionadas;

      await atualizarAtributo(
        `/professores/${professorSelecionado.id}`, dadosFiltrados, setProfessorAtualizado, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Professor atualizado com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar o professor", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setProfessorAtualizado({
      ...professorAtualizado,
      [e.target.name]: e.target.value,
    });
  }

  async function buscarDisciplinas() {
    try {
      await buscar("/disciplinas", setdisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar disciplinas", error);
    }
  }

  async function buscarTurmas() {
    try {
      await buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  }

  useEffect(() => {
    if (open) {
      buscarDisciplinas();
      buscarTurmas();
    }
  }, [open]);

  useEffect(() => {
    if (professorSelecionado) {
      setProfessorAtualizado({...professorSelecionado});

      setDisciplinaIdsSelecionadas(professorSelecionado.disciplinaIds || []);
      setTurmaIdsSelecionadas(professorSelecionado.turmaIds || []);
    }
  }, [professorSelecionado, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarProfessor}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Professor
              </h2>
            </Card>

            <TextInput
              name="nome"
              required
              value={professorAtualizado.nome || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              name="email"
              required
              value={professorAtualizado.email || ""}
              onChange={atualizarEstado}
            />

            <MultiSelectDropdown
              titulo="Disciplinas *"
              opcoes={disciplinas}
              selecionados={disciplinaIdsSelecionadas}
              setSelecionados={setDisciplinaIdsSelecionadas}
            />

            <MultiSelectDropdown
              titulo="Turmas (opcional)"
              opcoes={turmas}
              selecionados={turmaIdsSelecionadas}
              setSelecionados={setTurmaIdsSelecionadas}
            />

            <Button
              type="submit"
              color="green"
              className='cursor-pointer mt-6 focus:outline-none focus:ring-0'>
              {isLoading ? <Spinner size="md" light/> : <span>Salvar Alterações</span>}
            </Button>
          </form>

        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarProfessor;

