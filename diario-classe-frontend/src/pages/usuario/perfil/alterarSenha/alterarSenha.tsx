import {useState, type ChangeEvent} from "react";
import {Modal, Button, Label, TextInput, ModalHeader, ModalBody} from "flowbite-react";

import {useAuth} from "../../../../contexts/UseAuth.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {atualizarAtributo} from "../../../../services/Service.ts";

export default function AlterarSenha({ show, onClose }) {
  const { usuario } = useAuth();
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.novaSenha !== form.confirmarSenha) {
      ToastAlerta("As senhas não coincidem!", Toast.Error);
      return;
    }

    try {
      await atualizarAtributo(`/usuarios/${usuario.id}/senha`, form, setForm, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        }
      });
      ToastAlerta("Senha alterada com sucesso!", Toast.Success);
      onClose();
    } catch {
      ToastAlerta("Erro ao alterar senha", Toast.Error);
    }
  }

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader>Alterar Senha</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="senhaAtual" />
            <TextInput
              id="senhaAtual"
              type="password"
              placeholder="Senha Atual"
              required
              value={form.senhaAtual}
              onChange={(e) =>
                setForm({ ...form, senhaAtual: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="novaSenha"/>
            <TextInput
              id="novaSenha"
              type="password"
              placeholder="Nova Senha"
              required
              value={form.novaSenha}
              onChange={(e) => setForm({ ...form, novaSenha: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="confirmarSenha"/>
            <TextInput
              id="confirmarSenha"
              type="password"
              placeholder="Confirmar Nova Senha"
              required
              value={form.confirmarSenha}
              onChange={(e) =>
                setForm({ ...form, confirmarSenha: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button color="gray" onClick={onClose}>
              Cancelar
            </Button>
            <Button color="warning" type="submit">
              Atualizar
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
