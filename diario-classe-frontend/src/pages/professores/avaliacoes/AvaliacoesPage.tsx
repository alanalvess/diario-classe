import React, {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Card,
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react";
import type {Avaliacao, Disciplina, Professor, Turma} from "../../../models";
import {buscar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import EditarAvaliacao from "./editarAvaliacao/EditarAvaliacao.tsx";
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import CadastroAvaliacao from "./cadastroAvaliacao/CadastroAvaliacao.tsx";
import DeletarObservacao from "../observacoes/deletarObservacao/DeletarObservacao.tsx";
import DeletarAvaliacao from "./deletarAvaliacao/DeletarAvaliacao.tsx";

export default function AvaliacoesPage() {
  const {usuario, isAuthenticated, isLoading} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [professor, setProfessor] = useState<Professor>();

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalEditarAvaliacao, setModalEditarAvaliacao] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);

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

  async function recarregarAvaliacoes() {
    try {
      let endpoint = "";

      if (turmaSelecionada && disciplinaSelecionada) {
        endpoint = `/avaliacoes/turma/${turmaSelecionada}/disciplina/${disciplinaSelecionada}`;
      } else if (turmaSelecionada) {
        endpoint = `/avaliacoes/turma/${turmaSelecionada}`;
      } else if (disciplinaSelecionada) {
        endpoint = `/avaliacoes/disciplina/${disciplinaSelecionada}`;
      } else {
        setAvaliacoes([]);
        return; // nenhum filtro selecionado → não busca nada
      }

      await buscar(endpoint, setAvaliacoes, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      ToastAlerta("Erro ao carregar avaliações", Toast.Error);
    }
  }

// Atualiza a cada mudança de filtro
  useEffect(() => {
    if ((turmaSelecionada || disciplinaSelecionada) && isAuthenticated) {
      recarregarAvaliacoes();
    } else {
      setAvaliacoes([]);
    }
  }, [turmaSelecionada, disciplinaSelecionada, isAuthenticated]);


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



  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Registro de Avaliações
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Gerencie todos as avaliações por turma e disciplina.
        </p>

        <Button
          color="alternative"
          className="cursor-pointer mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"
          onClick={() => setModalCadastro(true)}
        >
          <FaPlus className="text-lg"/> Adicionar Avaliação
        </Button>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select
          className="flex-1"
          value={turmaSelecionada ?? ""}
          onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a turma</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} ({turma.anoLetivo})
            </option>
          ))}
        </Select>

        <Select
          className="flex-1"
          value={disciplinaSelecionada ?? ""}
          onChange={(e) => setDisciplinaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </Select>
      </div>

      {/* Lista de Avaliações */}
      {!turmaSelecionada ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span>
          escolha uma turma e/ou uma disciplina para visualizar as avaliações.
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        <div className="w-full">
          <div
            className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="text-center font-semibold">Título</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Data</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Peso</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Bimestre</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Média</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                {avaliacoes.length > 0 ? (
                  avaliacoes.map((a) => (
                    <TableRow
                      key={a.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                    >
                      <TableCell className="text-center font-medium text-gray-900 dark:text-gray-100">
                        {a.titulo}
                      </TableCell>
                      <TableCell className="text-center">{a.data}</TableCell>
                      <TableCell className="text-center">{a.peso}</TableCell>
                      <TableCell className="text-center">{a.bimestre}</TableCell>
                      <TableCell className="text-center">{a.media?.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setAvaliacaoSelecionada(a);
                              setModalEditarAvaliacao(true);
                            }}
                            className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                          >
                            <FaEdit size={18}/>
                          </Button>
                          <Button
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setAvaliacaoSelecionada(a);
                              setModalExclusao(true);
                            }}
                            className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                          >
                            <FaTrashAlt size={18}/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                      Nenhuma avaliação cadastrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 📱 Layout mobile */}
          <div className="block md:hidden space-y-4">
            {avaliacoes.length > 0 ? (
              avaliacoes.map((a) => (
                <div
                  key={a.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {a.titulo}
                    </h2>
                    <span className="text-sm text-gray-500">{a.data}</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p><strong>Peso:</strong> {a.peso}</p>
                    <p><strong>Bimestre:</strong> {a.bimestre}</p>
                    <p><strong>Média:</strong> {a.media?.toFixed(2) ?? "—"}</p>
                  </div>
                  <div className="flex justify-end gap-3 mt-3">
                    <Button
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setAvaliacaoSelecionada(a);
                        setModalEditarAvaliacao(true);
                      }}
                      className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                    >
                      <FaEdit size={18}/>
                    </Button>
                    <Button
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setAvaliacaoSelecionada(a);
                        setModalExclusao(true);
                      }}
                      className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                    >
                      <FaTrashAlt size={18}/>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Nenhuma avaliação cadastrada.
              </p>
            )}
          </div>
        </div>
      )}

      <CadastroAvaliacao
        open={modalCadastro}
        onClose={() => setModalCadastro(false)}
        onSaved={recarregarAvaliacoes}
      />

      {avaliacaoSelecionada && (
      <EditarAvaliacao
        open={modalEditarAvaliacao}
        onClose={() => setModalEditarAvaliacao(false)}
        onSaved={recarregarAvaliacoes}
        avaliacaoSelecionada={avaliacaoSelecionada}
      />
      )}

      {avaliacaoSelecionada && (
        <DeletarAvaliacao
          isOpen={modalExclusao}
          onClose={() => {
            setModalExclusao(false);
            setAvaliacaoSelecionada(null);
          }}
          avaliacaoSelecionada={avaliacaoSelecionada}
          aoDeletar={() => recarregarAvaliacoes}
        />
      )}
    </div>
  );
}

