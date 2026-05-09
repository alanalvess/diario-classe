import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput, ToggleSwitch} from "flowbite-react";

import {cadastrar} from "../../../services/Service";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta";
import type {Usuario} from "../../../models"
import {useAuth} from "../../../contexts/UseAuth.ts";
// import {Role} from "../../../utils/Role.ts";
// import type {Roles} from "../../../enums/Roles.ts";

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

  const [rfidDados, setRfidDados] = useState({
    uid: "",
    email: "",
    ativo: true
  });

  //
  // async function editarUsuario(e: ChangeEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setIsLoading(true);
  //
  //   try {
  //     // 🔹 Clona e filtra o objeto para enviar só o que tem valor
  //     const dadosFiltrados = Object.fromEntries(
  //       Object.entries(usuarioAtualizado).filter(([key, value]) => {
  //         if (value === "" || value === null || value === undefined) return false;
  //         if (key === "id" || key === "token") return false; // não envia campos não editáveis
  //         return true;
  //       })
  //     );
  //
  //     if (Array.isArray(usuarioAtualizado.roles) && usuarioAtualizado.roles.length > 0) {
  //       dadosFiltrados.roles = usuarioAtualizado.roles;
  //     }
  //
  //     await atualizarAtributo(
  //       `/rfid/vincular`, dadosFiltrados, setUsuarioAtualizado, {
  //         headers: {
  //           Authorization: `Bearer ${usuario.token}`,
  //           "Content-Type": "application/json",
  //         }
  //       }
  //     );
  //
  //     ToastAlerta("Usuário atualizado com sucesso", Toast.Success);
  //     onSaved?.();
  //     onClose?.();
  //   } catch (error) {
  //     if (error.toString().includes("403")) {
  //       ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
  //       handleLogout();
  //     } else {
  //       ToastAlerta("Erro ao atualizar o usuário", Toast.Warning);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }


  // function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  //   setUsuarioAtualizado({
  //     ...usuarioAtualizado,
  //     [e.target.name]: e.target.value,
  //   });
  // }

  useEffect(() => {
    if (usuarioSelecionado) {
      setRfidDados({
        uid: "", // Começa vazio para nova leitura ou você pode buscar do banco se preferir
        email: usuarioSelecionado.email,
        ativo: true
      });
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

