import React, {useEffect, useState} from "react";
import {Button, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import type {Avaliacao, Disciplina, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import EditarAvaliacao from "./editarAvaliacao/EditarAvaliacao.tsx";
import {FaEdit, FaTrashAlt} from "react-icons/fa";

export default function AvaliacoesPage() {
  const {usuario, isHydrated, isAuthenticated, isLoading} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);

  const [modalEditarAvaliacao, setModalEditarAvaliacao] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  // Formulário para nova avaliação
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [peso, setPeso] = useState(1);

  // async function buscarAvaliacoes() {
  //   try {
  //     await buscar("/avaliacoes", setAvaliacoes, {
  //       headers: {Authorization: `Bearer ${usuario.token}`},
  //     });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       ToastAlerta("Erro ao carregar avaliações", Toast.Error);
  //     }
  //   }
  // }

  async function buscarTurmas() {
    try {
      await buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar turmas", Toast.Error);
      }
    }
  }

  async function recarregarAvaliacoes() {
    if (!disciplinaSelecionada) return;
    try {
      await buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
    } catch {
      ToastAlerta("Erro ao carregar avaliações", Toast.Error);
    }
  }

  useEffect(() => {
    if (disciplinaSelecionada && isAuthenticated) {
      recarregarAvaliacoes();
    }
  }, [disciplinaSelecionada, isAuthenticated]);


  // 🔹 Buscar turmas
  useEffect(() => {
    if (isHydrated && isAuthenticated) {

      // buscarAvaliacoes();
      buscarTurmas();
    }
  }, [isAuthenticated, isHydrated]);

  // 🔹 Buscar disciplinas da turmas
  useEffect(() => {
    if (turmaSelecionada && isAuthenticated) {
      buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    }
  }, [turmaSelecionada, isAuthenticated]);

  // 🔹 Buscar avaliações da disciplina
  useEffect(() => {
    if (disciplinaSelecionada && isAuthenticated) {
      buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    }
  }, [disciplinaSelecionada, isAuthenticated]);

  // Criar avaliação
  async function salvarAvaliacao() {
    if (!disciplinaSelecionada || !turmaSelecionada) {
      ToastAlerta("Selecione uma turmas e disciplina", Toast.Error);
      return;
    }

    const body = {
      titulo,
      data,
      peso,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
    };

    try {
      await cadastrar("/avaliacoes", body, () => {
      }, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
      ToastAlerta("✅ Avaliação cadastrada", Toast.Success);
      setTitulo("");
      setData("");
      setPeso(1);
      buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch {
      ToastAlerta("Erro ao salvar avaliação", Toast.Error);
    }
  }

  async function excluirAvaliacao(id: number) {
    try {
      await deletar(`/avaliacoes/${id}`, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
      ToastAlerta("🗑️ Avaliação excluída", Toast.Success);
      setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
    } catch {
      ToastAlerta("Erro ao excluir avaliação", Toast.Error);
    }
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Avaliações</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2 flex-1"
          value={turmaSelecionada ?? ""}
          onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a turma</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} ({turma.anoLetivo})
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 flex-1"
          value={disciplinaSelecionada ?? ""}
          onChange={(e) => setDisciplinaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Formulário de Avaliação */}
      {disciplinaSelecionada && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Título"
            className="border rounded p-2 flex-1"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <input
            type="number"
            className="border rounded p-2 w-24"
            value={peso}
            onChange={(e) => setPeso(Number(e.target.value))}
            min={1}
          />
          <Button
            onClick={salvarAvaliacao}
            disabled={
              !titulo.trim() || // título vazio
              !data ||          // sem data
              !peso || peso <= 0 || // peso inválido
              !turmaSelecionada ||  // turma não escolhida
              !disciplinaSelecionada // disciplina não escolhida
            }
            className={`${
              !titulo.trim() || !data || !peso || !turmaSelecionada || !disciplinaSelecionada
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ?
              <Spinner aria-label="Default status example" size='md'/> :
              <span>Salvar Avaliação</span>
            }
          </Button>

        </div>
      )}

      {/* Lista de Avaliações */}
      {avaliacoes.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Título</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
            <TableHeadCell>Peso</TableHeadCell>
            <TableHeadCell>Média</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {avaliacoes.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.titulo}</TableCell>
                <TableCell>{a.data}</TableCell>
                <TableCell>{a.peso}</TableCell>
                <TableCell>{a.media?.toFixed(2)}</TableCell>
                <TableCell>
                  <div className='flex flex-row gap-4'>
                    <Button
                      color="warning"
                      size="xs"
                      onClick={() => {
                        setAvaliacaoSelecionada(a)
                        setModalEditarAvaliacao(true);
                      }}
                      className='cursor-pointer'
                    >
                      <FaEdit size={20}/>
                    </Button>

                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => excluirAvaliacao(a.id)}
                    >
                      <FaTrashAlt size={20}/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EditarAvaliacao
        open={modalEditarAvaliacao}
        onClose={() => setModalEditarAvaliacao(false)}
        onSaved={recarregarAvaliacoes}
        avaliacaoSelecionada={avaliacaoSelecionada}
      />
    </div>
  );
}

