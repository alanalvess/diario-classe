import React, {type ChangeEvent, type FormEvent, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import type {Usuario} from "../../../models";
import {cadastrar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {Roles} from "../../../enums/Roles.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";

interface CadastroProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function Cadastro({
                    open,
                    onClose,
                    onSaved,
                  }: CadastroProps) {
  const {usuario} = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [usuarioCadastro, setUsuarioCadastro] = useState<Usuario>(
    {
      id: 0,
      nome: "",
      email: "",
      senha: "",
      roles: [] as Roles[],
    }
  )

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (confirmarSenha === usuarioCadastro.senha && usuarioCadastro.senha.length >= 8) {
      setIsLoading(true);

      try {
        await cadastrar(`/usuarios/cadastrar`, usuarioCadastro, setUsuarioCadastro, {
          headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
        });

        ToastAlerta("Usuário cadastrado com sucesso", Toast.Success);
        onSaved();

        // 🔹 Fecha o modal
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          ToastAlerta("Erro ao cadastrar usuário", Toast.Error);
        }
      } finally {
        setIsLoading(false);
      }

    } else {
      ToastAlerta("Dados inconsistentes. Verifique as informações de cadastro.", Toast.Warning);
      setUsuarioCadastro({...usuarioCadastro, senha: ""});
      setConfirmarSenha("");
    }

    setIsLoading(false);
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value);
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const {name, value} = e.target;

    if (name === "roles") {
      setUsuarioCadastro({...usuarioCadastro, roles: [value as Roles]});
    } else {
      setUsuarioCadastro({...usuarioCadastro, [name]: value});
    }
  }

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={cadastrarNovoUsuario}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cadastro de Usuário
              </h2>
            </Card>

            <TextInput
              id="nome"
              name="nome"
              type="text"
              autoComplete="nome"
              placeholder="Nome"
              required
              value={usuarioCadastro.nome}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />

            <TextInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="email@email.com"
              required
              value={usuarioCadastro.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                atualizarEstado(e)
              }
            />

            <TextInput
              id="senha"
              name="senha"
              type="password"
              autoComplete="senha"
              placeholder="senha"
              required
              value={usuarioCadastro.senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                atualizarEstado(e)
              }
            />

            <TextInput
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="confirmarSenha"
              type="password"
              required
              value={confirmarSenha}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleConfirmarSenha(e)
              }
            />

            <Select
              id="roles"
              name="roles"
              value={usuarioCadastro.roles[0] || ""}
              onChange={atualizarEstado}
              required
            >
              <option value="">Selecione o tipo</option>
              {Object.values(Roles).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>

            <Button color="green" type="submit" className='cursor-pointer mt-6 focus:outline-none focus:ring-0'>
              {isLoading ?
                <Spinner size="md" light/> :
                <span>Cadastrar</span>
              }
            </Button>
          </form>

        </ModalBody>
      </Modal>
    </>
  )
}

export default Cadastro;
