import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import {atualizarAtributo} from "../../../services/Service";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta";
import type {Usuario} from "../../../models"
import {useAuth} from "../../../contexts/UseAuth.ts";
import {Role} from "../../../utils/Role.ts";
import type {Roles} from "../../../enums/Roles.ts";

interface EditarUsuarioProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  usuarioSelecionado?: Usuario | null;
}

function EditarUsuario({
                         open,
                         onClose,
                         onSaved,
                         usuarioSelecionado
                       }: EditarUsuarioProps) {

  const [usuarioAtualizado, setUsuarioAtualizado] = useState<Usuario>(
    {} as Usuario
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  //
  async function editarUsuario(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(usuarioAtualizado).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      if (Array.isArray(usuarioAtualizado.roles) && usuarioAtualizado.roles.length > 0) {
        dadosFiltrados.roles = usuarioAtualizado.roles;
      }

      await atualizarAtributo(
        `/usuarios/${usuarioSelecionado.id}`, dadosFiltrados, setUsuarioAtualizado, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Usuário atualizado com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar o usuário", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }


  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUsuarioAtualizado({
      ...usuarioAtualizado,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (usuarioSelecionado) {
      setUsuarioAtualizado({...usuarioSelecionado, senha: ''});
    }
  }, [usuarioSelecionado, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarUsuario}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Usuário
              </h2>
            </Card>

            <TextInput
              name="nome"
              required
              value={usuarioAtualizado.nome || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              name="email"
              required
              value={usuarioAtualizado.email || ""}
              onChange={atualizarEstado}
            />

            <Select
              id="roles"
              name="roles"
              value={usuarioAtualizado.roles?.[0] || ""}
              onChange={e =>
                setUsuarioAtualizado({
                  ...usuarioAtualizado,
                  roles: [e.target.value as Roles], // mantém o formato array
                })
              }
              required
            >
              <option value="">Selecione uma função</option>
              {Role.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>

            <Button color="green" type="submit" className='cursor-pointer mt-6 focus:outline-none focus:ring-0'>
              {isLoading ? <Spinner size="sm" light/> : <span>Salvar Alterações</span>}
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarUsuario;

