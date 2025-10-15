import React, {useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Aluno, Disciplina, Observacao, Turma} from "../../../models";
import {RotatingLines} from "react-loader-spinner";
import {CategoriaObservacao} from "../../../enums/CategoriaObservacao.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import EditarObservacao from "./editarObservacao/EditarObservacao.tsx";
import {FaEdit, FaTrashAlt} from "react-icons/fa";

export default function RegistroObservacoesPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  const [isLoading, setIsLoading] = useState(false);

  const [modalEditarObservacao, setModalEditarObservacao] = useState(false);
  const [observacaoSelecionada, setObservacaoSelecionada] = useState<Observacao | null>(null);

  async function buscarObservacoes() {
    try {
      await buscar("/observacoes", setObservacoes, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar observações", Toast.Error);
      }
    }
  }
  // 🔹 Buscar turmas do professor
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    }
  }, [isHydrated, isAuthenticated]);

  // 🔹 Buscar disciplinas da turmas
  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }, [turmaSelecionada, isAuthenticated]);

  // 🔹 Buscar alunos da disciplina
  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/alunos/turma/${turmaSelecionada}`, setAlunos, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }, [disciplinaSelecionada, isAuthenticated]);

  // 🔹 Buscar observações da turmas + disciplina (opcional filtro por aluno)
  useEffect(() => {
    if (!disciplinaSelecionada || !turmaSelecionada) return;

    let url = `/observacoes`;
    if (alunoSelecionado) {
      url = `/observacoes/aluno/${alunoSelecionado}`;
    }

    buscar(url, setObservacoes, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [turmaSelecionada, disciplinaSelecionada, alunoSelecionado, isAuthenticated]);

  // 🔹 Salvar nova observação
  async function salvarObservacao() {
    if (!alunoSelecionado || !turmaSelecionada || !disciplinaSelecionada) return;

    const body = {
      alunoId: alunoSelecionado,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
      descricao,
      categoria,
      data,
    };

    try {
      await cadastrar("/observacoes", body, (novaObs: Observacao) => {
        setObservacoes(prev => [...prev, novaObs]);
        setDescricao("");
        setCategoria("");
      }, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });

      ToastAlerta("✅ Observação salva", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao salvar observação", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir observação
  async function excluirObservacao(id: number) {
    try {
      await deletar(`/observacoes/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
      setObservacoes(prev => prev.filter(observacao => observacao.id !== id));
      ToastAlerta("✅ Observação excluída", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir observação", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Registro de Observações</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={turmaSelecionada ?? ""} onChange={e => setTurmaSelecionada(Number(e.target.value))}>
          <option value="">Selecione a turma</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.anoLetivo})</option>)}
        </select>

        <select value={disciplinaSelecionada ?? ""} onChange={e => setDisciplinaSelecionada(Number(e.target.value))}>
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>

        <select value={alunoSelecionado ?? ""} onChange={e => setAlunoSelecionado(Number(e.target.value))}>
          <option value="">Selecione o aluno</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
      </div>

      {/* Formulário de observação */}
      <div className="flex flex-col gap-2 mb-6">
        <input type="date" value={data} onChange={e => setData(e.target.value)} className="border rounded p-2"/>

        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaObservacao)}
          className="border rounded p-2 w-full bg-white dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Selecione uma categoria</option>
          {Object.values(CategoriaObservacao).map((valor) => (
            <option key={valor} value={valor}>
              {valor.charAt(0) + valor.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)}
                  className="border rounded p-2"/>

        <Button onClick={salvarObservacao}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Salvar Observação</span>}
        </Button>
      </div>

      {/* Tabela de observações */}
      {observacoes.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
            <TableHeadCell>Categoria</TableHeadCell>
            <TableHeadCell>Descrição</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {observacoes.map((obs, i) => (
              <TableRow key={i}>
                <TableCell>{alunos.find(a => a.id === obs.alunoId)?.nome || "—"}</TableCell>
                <TableCell>{obs.data}</TableCell>
                <TableCell>{obs.categoria}</TableCell>
                <TableCell>{obs.descricao}</TableCell>
                <TableCell>
                  <div className='flex flex-row gap-4'>
                    <Button
                      color="warning"
                      size="xs"
                      onClick={() => {
                        // editaAluno(aluno.id);
                        setObservacaoSelecionada(obs)
                        setModalEditarObservacao(true);
                      }}
                      className='cursor-pointer'
                    >
                      <FaEdit size={20}/>
                    </Button>

                    <Button
                      color="danger"
                      size="xs"
                      onClick={() => excluirObservacao(obs.id)}
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

      <EditarObservacao
        open={modalEditarObservacao}
        onClose={() => setModalEditarObservacao(false)}
        onSaved={buscarObservacoes}
        observacaoSelecionada={observacaoSelecionada}
      />
    </div>
  );
}
