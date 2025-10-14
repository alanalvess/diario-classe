import {type FormEvent, useContext, useEffect, useState} from "react";
import {Modal, Button, Label, TextInput, ModalHeader, ModalBody} from "flowbite-react";
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

export default function EditarMeuUsuario({ show, onClose, onSaved, usuarioSelecionado }: EditarMeuUsuarioProps) {

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
    <Modal show={show} onClose={onClose}>
      <ModalHeader>Editar Dados do Usuário</ModalHeader>
      <ModalBody>
        <form onSubmit={editarMeuUsuario} className="space-y-4">
          <div>
            <Label htmlFor="nome" />
            <TextInput
              id="nome"
              value={meuUsuario.nome}
              onChange={(e) => setMeuUsuario({ ...meuUsuario, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" />
            <TextInput
              id="email"
              type="email"
              value={meuUsuario.email}
              onChange={(e) => setMeuUsuario({ ...meuUsuario, email: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button color="gray" onClick={onClose}>
              Cancelar
            </Button>
            <Button color="blue" type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
