import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import type {Disciplina, Professor, Turma} from "../../../../models";
import {buscar, cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface CadastroAvaliacaoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CadastroAvaliacao({open, onClose, onSaved}: CadastroAvaliacaoProps) {
  const {usuario} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professor, setProfessor] = useState<Professor>();


  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [peso, setPeso] = useState(1);
  const [bimestre, setBimestre] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarTurmasPorProfessor() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      )
      ;
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function buscarDisciplinasPorTurma() {
    if (!turmaSelecionada) return;
    await buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }

  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);

  useEffect(() => {
    if (professor?.id) {
      buscarTurmasPorProfessor();
    }
  }, [professor]);

  useEffect(() => {
    if (turmaSelecionada) buscarDisciplinasPorTurma();
  }, [turmaSelecionada]);

  function limparCampos() {
    setTitulo("");
    setData("");
    setPeso(1);
    setBimestre(1);
    setTurmaSelecionada(null);
    setDisciplinaSelecionada(null);
  }

  async function cadastrarAvaliacao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!titulo || !data || !peso || !bimestre || !turmaSelecionada || !disciplinaSelecionada) {
      ToastAlerta("Preencha todos os campos obrigatórios", Toast.Warning);
      return;
    }

    const body = {
      titulo,
      data,
      peso,
      bimestre,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
    };

    try {
      setIsLoading(true);
      await cadastrar("/avaliacoes", body, () => {
      }, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
      ToastAlerta("✅ Avaliação cadastrada com sucesso", Toast.Success);
      limparCampos();
      onSaved();
      onClose();
    } catch {
      ToastAlerta("Erro ao cadastrar avaliação", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal show={open} onClose={onClose} size="lg" popup>
      <ModalHeader/>
      <ModalBody>
        <form className="flex flex-col gap-4" onSubmit={cadastrarAvaliacao}>
          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Nova Avaliação
            </h2>
          </Card>

          <Select
            value={turmaSelecionada ?? ""}
            onChange={e => setTurmaSelecionada(Number(e.target.value))}
            required
            className="rounded bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Selecione a turma</option>
            {turmas.map(t => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.anoLetivo})
              </option>
            ))}
          </Select>

          <Select
            value={disciplinaSelecionada ?? ""}
            onChange={e => setDisciplinaSelecionada(Number(e.target.value))}
            required
            className="rounded bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Selecione a disciplina</option>
            {disciplinas.map(d => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </Select>

          <TextInput
            type="text"
            placeholder="Título da avaliação"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
          />

          <TextInput
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />

          <TextInput
            type="number"
            min={1}
            placeholder="Peso"
            value={peso}
            onChange={e => setPeso(Number(e.target.value))}
            required
          />

          <Select
            value={bimestre}
            onChange={e => setBimestre(Number(e.target.value))}
            required
          >
            <option value="1">1º Bimestre</option>
            <option value="2">2º Bimestre</option>
            <option value="3">3º Bimestre</option>
            <option value="4">4º Bimestre</option>
          </Select>

          <Button color="green" type="submit" className='cursor-pointer mt-6 focus:outline-none focus:ring-0'>
            {isLoading ? <Spinner size="sm" light/> : <span>Cadastrar</span>}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}