import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Disciplina, Professor, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";

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

  const [professorAtualizado, setProfessorAtualizado] = useState<Professor>(
    {} as Professor
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [disciplinas, setdisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);


  //
  async function editarProfessor(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(professorAtualizado).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );
      console.log("Payload enviado:", dadosFiltrados);

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
    }
  }, [open]);

  useEffect(() => {

    if (open) {
      buscarTurmas();
    }
  }, [open]);

  useEffect(() => {
    if (professorSelecionado) {
      setProfessorAtualizado({...professorSelecionado});
    }
  }, [professorSelecionado, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarProfessor}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Professor
                </h2>

                <InputField
                  label="Nome"
                  name="nome"
                  required
                  value={professorAtualizado.nome || ""}
                  onChange={atualizarEstado}
                />

                <InputField
                  label="Email"
                  name="email"
                  required
                  value={professorAtualizado.email || ""}
                  onChange={atualizarEstado}
                />

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                  Disciplinas
                </label>
                <select
                  multiple
                  value={professorAtualizado.disciplinaIds?.map(String) || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                    setProfessorAtualizado({
                      ...professorAtualizado,
                      disciplinaIds: values,
                    });
                  }}
                  className="border rounded p-2 w-full dark:bg-gray-800 dark:text-gray-100"
                >
                  {disciplinas.map(disciplina => (
                    <option key={disciplina.id} value={disciplina.id}>{disciplina.nome}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Turmas
                </label>
                <select
                  multiple
                  value={professorAtualizado.turmaIds?.map(String) || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                    setProfessorAtualizado({
                      ...professorAtualizado,
                      turmaIds: values,
                    });
                  }}
                  className="border rounded p-2 w-full dark:bg-gray-800 dark:text-gray-100"
                >
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>{turma.nome}</option>
                  ))}
                </select>

                <Button type="submit">
                  {isLoading ? <Spinner aria-label="Carregando"/> : <span>Salvar Alterações</span>}
                </Button>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarProfessor;

