import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import type {Aluno, Responsavel} from "../../../../models";
import {buscar, cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";

import type {Filiacao} from "../../../../enums/Filiacao.ts";
import {FiliacaoText} from "../../../../utils/FiliacaoText.ts";
import {FaSearch} from "react-icons/fa";

interface CadastroResponsavelProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  alunoSelecionado: Aluno;
}

export default function CadastroResponsavel({open, onClose, onSaved, alunoSelecionado}: CadastroResponsavelProps) {
  const {usuario} = useAuth();

  const [responsavelCadastro, setResponsavelCadastro] = useState<Responsavel>({
    id: 0,
    nome: "",
    email: "",
    telefone: "",
    filiacao: "" as Filiacao,
    alunoIds: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [responsavelEncontrado, setResponsavelEncontrado] = useState<boolean | null>(null);

  async function buscarResponsavelPorEmail() {
    if (!responsavelCadastro.email) return;

    setIsSearching(true);
    try {
      await buscar(
        `/responsaveis/email/${responsavelCadastro.email}`,
        (data: Responsavel) => {
          if (data) {
            setResponsavelCadastro(data);
            setResponsavelEncontrado(true);
            ToastAlerta("Responsável encontrado! Pronto para associar.", Toast.Info);
          } else {
            setResponsavelEncontrado(false);
            ToastAlerta("Nenhum responsável encontrado. Preencha os dados para cadastrar.", Toast.Warning);
          }
        },
        {
          headers: { Authorization: `Bearer ${usuario.token}` },
        }
      );
    } catch {
      setResponsavelCadastro((prev) => ({
        ...prev,
        id: 0,
        nome: "",
        telefone: "",
        filiacao: "" as Filiacao,
        alunoIds: [],
      }));
      setResponsavelEncontrado(false);
      ToastAlerta("Nenhum responsável encontrado. Preencha os dados para cadastrar.", Toast.Warning);
    } finally {
      setIsSearching(false);
    }
  }




  async function cadastrarNovoResponsavel(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await cadastrar(`/responsaveis/aluno/${alunoSelecionado.id}`, responsavelCadastro, () => {
      }, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });

      ToastAlerta("Responsável cadastrado com sucesso!", Toast.Success);
      onSaved();
      onClose();
    } catch {
      ToastAlerta("Erro ao cadastrar responsável", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  // // Resetar o formulário ao abrir
  // useEffect(() => {
  //   if (open) {
  //     setResponsavelCadastro({
  //       id: 0,
  //       nome: "",
  //       email: "",
  //       telefone: "",
  //       filiacao: "" as Filiacao,
  //       alunoIds: [],
  //     });
  //   }
  // }, [open]);

  useEffect(() => {
    if (open) {
      // Quando abrir o modal: limpar o formulário
      setResponsavelCadastro({
        id: 0,
        nome: "",
        email: "",
        telefone: "",
        filiacao: "" as Filiacao,
        alunoIds: [],
      });
      setResponsavelEncontrado(null);
    } else {
      // Quando fechar o modal: limpar completamente tudo
      setResponsavelCadastro({
        id: 0,
        nome: "",
        email: "",
        telefone: "",
        filiacao: "" as Filiacao,
        alunoIds: [],
      });
      setResponsavelEncontrado(null);
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [open]);


  return (
    <Modal show={open} onClose={onClose} size="md" popup>
      <ModalHeader/>

      <ModalBody>
        <form className="flex flex-col gap-4" onSubmit={cadastrarNovoResponsavel}>
          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Adicionar Responsável
            </h2>
          </Card>

          {/* 🔍 Campo de e-mail + botão de busca */}
          {/*<div className="flex gap-2">*/}
          {/*  <TextInput*/}
          {/*    id="email"*/}
          {/*    name="email"*/}
          {/*    type="email"*/}
          {/*    placeholder="E-mail"*/}
          {/*    required*/}
          {/*    className="flex-1"*/}
          {/*    value={responsavelCadastro.email}*/}
          {/*    onChange={(e) =>*/}
          {/*      setResponsavelCadastro({ ...responsavelCadastro, email: e.target.value })*/}
          {/*    }*/}
          {/*  />*/}
          {/*  <Button*/}
          {/*    type="button"*/}
          {/*    color="info"*/}
          {/*    disabled={isSearching}*/}
          {/*    onClick={buscarResponsavelPorEmail}*/}
          {/*    className="flex items-center gap-1"*/}
          {/*  >*/}
          {/*    {isSearching ? <Spinner size="sm" light /> : <FaSearch />}*/}
          {/*    Buscar*/}
          {/*  </Button>*/}
          {/*</div>*/}

          <div className="relative w-full">
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="Buscar E-Mail"
              required
              value={responsavelCadastro.email}
              onChange={(e) =>
                setResponsavelCadastro({ ...responsavelCadastro, email: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && buscarResponsavelPorEmail()}
              className="w-full"
            />

            <button
              disabled={isSearching}
              onClick={buscarResponsavelPorEmail}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              {isSearching ? <Spinner size="sm" light /> : <FaSearch />}
              {/*<FaSearch size={18}/>*/}
            </button>
          </div>

          {/* 🔹 Campos aparecem após buscar ou digitar email */}
          {responsavelEncontrado !== null && (
            <>
              <TextInput
                id="nome"
                name="nome"
                placeholder="Nome completo"
                required
                readOnly={responsavelEncontrado === true}
                value={responsavelCadastro.nome}
                onChange={(e) =>
                  setResponsavelCadastro({ ...responsavelCadastro, nome: e.target.value })
                }
              />

              <TextInput
                id="telefone"
                name="telefone"
                placeholder="Telefone"
                required
                readOnly={responsavelEncontrado === true}
                value={responsavelCadastro.telefone}
                onChange={(e) =>
                  setResponsavelCadastro({ ...responsavelCadastro, telefone: e.target.value })
                }
              />

              <Select
                id="filiacao"
                name="filiacao"
                required
                disabled={responsavelEncontrado === true}
                value={responsavelCadastro.filiacao}
                onChange={(e) =>
                  setResponsavelCadastro({
                    ...responsavelCadastro,
                    filiacao: e.target.value as Filiacao,
                  })
                }

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
                className="cursor-pointer mt-6 focus:outline-none focus:ring-0"
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="md" light/> : "Salvar Responsável"}
              </Button>
            </>
          )}

          {/*<TextInput*/}
          {/*  id="nome"*/}
          {/*  name="nome"*/}
          {/*  placeholder="Nome completo"*/}
          {/*  required*/}
          {/*  value={responsavelCadastro.nome}*/}
          {/*  onChange={(e) => setResponsavelCadastro({...responsavelCadastro, nome: e.target.value})}*/}
          {/*/>*/}

          {/*<TextInput*/}
          {/*  id="email"*/}
          {/*  name="email"*/}
          {/*  type="email"*/}
          {/*  placeholder="E-mail"*/}
          {/*  required*/}
          {/*  value={responsavelCadastro.email}*/}
          {/*  onChange={(e) => setResponsavelCadastro({...responsavelCadastro, email: e.target.value})}*/}
          {/*/>*/}

          {/*<TextInput*/}
          {/*  id="telefone"*/}
          {/*  name="telefone"*/}
          {/*  placeholder="Telefone"*/}
          {/*  required*/}
          {/*  value={responsavelCadastro.telefone}*/}
          {/*  onChange={(e) => setResponsavelCadastro({...responsavelCadastro, telefone: e.target.value})}*/}
          {/*/>*/}

          {/*<Select*/}
          {/*  id="filiacao"*/}
          {/*  name="filiacao"*/}
          {/*  required*/}
          {/*  value={responsavelCadastro.filiacao}*/}
          {/*  onChange={(e) => setResponsavelCadastro({...responsavelCadastro, filiacao: e.target.value as Filiacao})}*/}
          {/*>*/}
          {/*  <option value="">Selecione a Filiação</option>*/}

          {/*  {FiliacaoText.map(({ value, label }) => (*/}
          {/*    <option key={value} value={value}>*/}
          {/*      {label}*/}
          {/*    </option>*/}
          {/*  ))}*/}
          {/*</Select>*/}


          {/*<Button*/}
          {/*  type="submit"*/}
          {/*  color="green"*/}
          {/*  className="cursor-pointer mt-6 focus:outline-none focus:ring-0"*/}
          {/*  disabled={isLoading}*/}
          {/*>*/}
          {/*  {isLoading ? <Spinner size="md" light/> : "Salvar Responsável"}*/}
          {/*</Button>*/}
        </form>
      </ModalBody>
    </Modal>
  );
}
