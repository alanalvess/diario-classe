import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo} from "../../../services/Service";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta";
import type {Usuario} from "../../../models"

import InputField from "../../../components/form/InputField.tsx";
import {useAuth} from "../../../contexts/UseAuth.ts";
import SelectField from "../../../components/form/SelectField.tsx";
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
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarUsuario}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Usuário
                </h2>

                <InputField
                  label="Nome"
                  name="nome"
                  required
                  value={usuarioAtualizado.nome || ""}
                  onChange={atualizarEstado}
                />

                <InputField
                  label="Email"
                  name="email"
                  required
                  value={usuarioAtualizado.email || ""}
                  onChange={atualizarEstado}
                />

                <SelectField
                  label="roles"
                  name="roles"
                  value={usuarioAtualizado.roles?.[0] || ""}
                  options={Role.map(r => ({ value: r.value, label: r.label }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setUsuarioAtualizado({
                      ...usuarioAtualizado,
                      roles: [e.target.value as Roles], // mantém como array
                    })
                  }
                />


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

export default EditarUsuario;

