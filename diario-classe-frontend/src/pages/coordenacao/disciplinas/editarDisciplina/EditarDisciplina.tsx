import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput} from "flowbite-react";

import {atualizarAtributo} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Disciplina} from "../../../../models"
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface EditarDisciplinaProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  disciplinaSelecionada?: Disciplina | null;
}

function EditarDisciplina({
                            open,
                            onClose,
                            onSaved,
                            disciplinaSelecionada
                          }: EditarDisciplinaProps) {

  const [disciplinaAtualizada, setDisciplinaAtualizada] = useState<Disciplina>(
    {} as Disciplina
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  async function editarDisciplina(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dadosFiltrados = Object.fromEntries(
        Object.entries(disciplinaAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      await atualizarAtributo(
        `/disciplinas/${disciplinaSelecionada.id}`, dadosFiltrados, setDisciplinaAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Disciplina atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a disciplina", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setDisciplinaAtualizada({
      ...disciplinaAtualizada,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (disciplinaSelecionada) {
      setDisciplinaAtualizada({...disciplinaSelecionada});
    }
  }, [disciplinaSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarDisciplina}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Disciplina
              </h2>
            </Card>

            <TextInput
              name="nome"
              placeholder="Nome"
              required
              value={disciplinaAtualizada.nome || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              name="codigo"
              placeholder="Código"
              required
              value={disciplinaAtualizada.codigo || ""}
              onChange={atualizarEstado}
            />

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
  )
    ;
}

export default EditarDisciplina;

