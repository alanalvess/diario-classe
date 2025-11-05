import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import {atualizarAtributo} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Responsavel} from "../../../../models"
import {useAuth} from "../../../../contexts/UseAuth.ts";
import {FiliacaoText} from "../../../../utils/FiliacaoText.ts";

interface EditarResponsavelProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  responsavelSelecionado?: Responsavel | null;
}

function EditarResponsavel({
                             open,
                             onClose,
                             onSaved,
                             responsavelSelecionado
                           }: EditarResponsavelProps) {

  const [ResponsavelAtualizado, setResponsavelAtualizado] = useState<Responsavel>(
    {} as Responsavel
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  async function editarResponsavel(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(ResponsavelAtualizado).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      await atualizarAtributo(
        `/responsaveis/${responsavelSelecionado.id}`, dadosFiltrados, setResponsavelAtualizado, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Responsável atualizado com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar o responsável do aluno", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setResponsavelAtualizado({
      ...ResponsavelAtualizado,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (responsavelSelecionado) {
      setResponsavelAtualizado({...responsavelSelecionado});
    }
  }, [responsavelSelecionado, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarResponsavel}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Responsável
              </h2>
            </Card>

            <TextInput
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome"
              required
              value={ResponsavelAtualizado.nome || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="E-mail"
              required
              value={ResponsavelAtualizado.email || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="Telefone"
              required
              value={ResponsavelAtualizado.telefone || ""}
              onChange={atualizarEstado}
            />

            <Select
              id="filiacao"
              name="filiacao"
              required
              value={ResponsavelAtualizado.filiacao}
              onChange={atualizarEstado}
            >
              <option value="">Selecione a Filiação</option>

              {FiliacaoText.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>

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
  );
}

export default EditarResponsavel;

