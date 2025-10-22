import React, {type FormEvent, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import {atualizarAtributo} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import type {Usuario} from "../../../../models";

interface EditarMeuUsuarioProps {
  show?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  usuarioSelecionado?: Usuario | null;
}

export default function EditarMeuUsuario({show, onClose, onSaved, usuarioSelecionado}: EditarMeuUsuarioProps) {

  const {usuario} = useAuth();
  const [meuUsuario, setMeuUsuario] = useState({
    nome: usuario.nome,
    email: usuario.email,
  });

  const [isLoading, setIsLoading] = useState(false);


  async function editarMeuUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await atualizarAtributo(
        `/usuarios/${usuarioSelecionado.id}`, meuUsuario, setMeuUsuario, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );


      ToastAlerta("Dados atualizados com sucesso!", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch {
      ToastAlerta("Erro ao atualizar os dados", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader/>
      <ModalBody>
        <form onSubmit={editarMeuUsuario} className="space-y-4">

          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Editar Meus Dados
            </h2>
          </Card>
          <TextInput
            id="nome"
            placeholder="Nome"
            value={meuUsuario.nome}
            onChange={(e) => setMeuUsuario({...meuUsuario, nome: e.target.value})}
            required
          />

          <TextInput
            id="email"
            type="email"
            placeholder="E-mail"
            value={meuUsuario.email}
            onChange={(e) => setMeuUsuario({...meuUsuario, email: e.target.value})}
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button
              className="cursor-pointer focus:outline-none focus:ring-0"
              color="alternative"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="cursor-pointer focus:outline-none focus:ring-0"
              color="green"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
