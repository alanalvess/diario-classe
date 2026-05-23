import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput, ToggleSwitch} from "flowbite-react";

import {buscar, cadastrar} from "../../../services/Service";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta";
import type {Usuario} from "../../../models"
import {useAuth} from "../../../contexts/UseAuth.ts";
import type {RfidCartao} from "../../../models/RfidCartao.ts";


interface RfidCardProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  usuarioSelecionado?: Usuario | null;
}

function RfidCardUsuario({
                           open,
                           onClose,
                           onSaved,
                           usuarioSelecionado
                         }: RfidCardProps) {

  // const [usuarioAtualizado, setUsuarioAtualizado] = useState<Usuario>({} as Usuario);
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [rfidDados, setRfidDados] = useState(
    {} as RfidCartao
  );

  useEffect(() => {
    if (usuarioSelecionado) {
      setRfidDados({
        uid: "",
        email: usuarioSelecionado.email,
        ativo: true
      });
    }

    if (open) {
      carregarRfid().then();
    }
  }, [usuarioSelecionado, open]);

  async function salvarRfid(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Envia para o endpoint de vínculo/atualização de RFID
      await cadastrar(`/rfid/vincular`, rfidDados, setRfidDados, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        }
      });

      ToastAlerta("Cartão RFID configurado com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("Sessão expirada", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao vincular cartão. Verifique se o UID já existe.", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Busca o UID do backend
  async function carregarRfid() {
    try {
      await buscar(
        `/rfid/${usuarioSelecionado.email}`, setRfidDados, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

    } catch (error) {
      console.error("Erro ao carregar RFID:", error);
      ToastAlerta("Não foi possível carregar os dados do cartão.", Toast.Warning);
    }
  }

  return (
    <Modal show={open} onClose={onClose} size="md" popup>
      <ModalHeader/>
      <ModalBody>
        <form className="flex flex-col gap-4" onSubmit={salvarRfid}>
          <Card className="mb-4 bg-gray-100 dark:bg-gray-800 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Configurar RFID
            </h2>
            <p className="text-xs text-gray-500">Controle de acesso por cartão</p>
          </Card>

          <TextInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="E-Mail"
            value={rfidDados.email}
            readOnly // Impede a edição
          />

          <TextInput
            id="uid"
            name="uid"
            type="text"
            autoComplete="uid"
            placeholder="Digite o código hexadecimal (ex: A1AA8B04)"
            required
            value={rfidDados.uid}
            onChange={(e) => setRfidDados({...rfidDados, uid: e.target.value.toUpperCase()})}
          />


          {/* Switch para Ativo/Inativo */}
          <ToggleSwitch
            checked={rfidDados.ativo}
            label={rfidDados.ativo ? "Ativo" : "Inativo"}
            onChange={(checked) => setRfidDados({...rfidDados, ativo: checked})}
          />

          <Button color="purple" type="submit" className="mt-4 focus:outline-none focus:ring-0">
            {isLoading ? <Spinner size="sm"/> : "Salvar Configurações"}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default RfidCardUsuario;

