import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {buscar, cadastrar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Aluno, Avaliacao, Disciplina, Nota, Turma} from "../../../models";
import {RotatingLines} from "react-loader-spinner";

export default function RegistroNotasPage() {
  const {usuario, isHydrated, isAuthenticated} = useContext(AuthContext);

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

  const [avaliacao, setAvaliacao] = useState<number | null>(null);
  const [disciplina, setDisciplina] = useState<number | null>(null);
  const [turma, setTurma] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Buscar turmas do professor
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    }
  }, [isAuthenticated, isHydrated]);

  // 🔹 Buscar disciplinas da turmas selecionada
  async function buscarDisciplinas() {
    if (!turma) return;
    await buscar(`/disciplinas/turma/${turma}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }

  // 🔹 Buscar avaliações da disciplina selecionada
  async function buscarAvaliacoes() {
    if (!disciplina) return;
    await buscar(`/avaliacoes/disciplina/${disciplina}`, setAvaliacoes, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }

  // 🔹 Buscar alunos da disciplina
  async function buscarAlunos() {
    if (!disciplina) return;
    await buscar(`/alunos/disciplina/${disciplina}`, setAlunos, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }

  // 🔹 Buscar notas por avaliação
  async function buscarNotas() {
    if (!avaliacao) return;
    setIsLoading(true);
    try {
      await buscar(`/notas/avaliacao/${avaliacao}`, setNotas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });

    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar notas", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Depois de buscar alunos e notas
  useEffect(() => {
    if (alunos.length > 0) {
      setNotas((prevNotas) => {
        return alunos.map((aluno) => {
          const notaExistente = prevNotas.find(n => n.alunoId === aluno.id);
          return notaExistente ?? {
            id: 0,
            alunoId: aluno.id,
            alunoNome: aluno.nome,
            disciplinaId: disciplina!,
            valor: 0
          };
        });
      });
    }
  }, [alunos, disciplina]);


  async function salvarNota(nota: Nota) {
    const body = {
      id: nota.id !== 0 ? nota.id : undefined,
      alunoId: nota.alunoId,
      alunoNome: nota.alunoNome,
      disciplinaId: disciplina,
      avaliacaoId: avaliacao,
      valor: nota.valor,
      dataLancamento: new Date().toISOString().split("T")[0],
    };

    try {
      await cadastrar("/notas", body, () => {
      }, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
      ToastAlerta(`✅ Nota de ${nota.alunoNome} salva`, Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao salvar nota", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }


  // 🔹 Efeitos
  useEffect(() => {
    if (turma && isAuthenticated) buscarDisciplinas();
  }, [turma, isAuthenticated]);

  useEffect(() => {
    if (disciplina && isAuthenticated) {
      buscarAlunos().then(() => buscarNotas());
      buscarAvaliacoes();
      setAvaliacao(null); // resetar avaliação ao mudar disciplina
      setNotas([]);
    }
  }, [disciplina, isAuthenticated]);

  useEffect(() => {
    if (avaliacao && isAuthenticated) buscarNotas();
  }, [avaliacao, isAuthenticated]);

  // 🔹 Combinar alunos + notas existentes
  const notasComAlunos = alunos.map(aluno => {
    const notaExistente = notas.find(n => n.alunoId === aluno.id);
    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      disciplinaId: disciplina,
      id: notaExistente?.id ?? null,
      valor: notaExistente?.valor ?? null,
    };
  });

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Registro de Notas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2 flex-1"
          value={turma ?? ""}
          onChange={(e) => setTurma(Number(e.target.value))}
        >
          <option value="">Selecione a turma</option>
          {turmas.map(t => (
            <option key={t.id} value={t.id}>
              {t.nome} ({t.anoLetivo})
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 flex-1"
          value={disciplina ?? ""}
          onChange={(e) => setDisciplina(Number(e.target.value))}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 flex-1"
          value={avaliacao ?? ""}
          onChange={(e) => setAvaliacao(Number(e.target.value))}
        >
          <option value="">Selecione a avaliação</option>
          {avaliacoes.map(a => (
            <option key={a.id} value={a.id}>
              {a.titulo}
            </option>
          ))}
        </select>

        <Button onClick={buscarNotas} disabled={!avaliacao}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>
              Carregar Notas
            </span>
          }
        </Button>
      </div>

      {/* Tabela de notas */}
      {alunos.length > 0 ? (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Nota</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {notasComAlunos.map(nota => (
              <TableRow key={nota.alunoId}>
                <TableCell>{nota.alunoNome}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={nota.valor ?? ""}
                    className="border rounded p-1 w-20"
                    onChange={(e) => {
                      const novoValor = Number(e.target.value);

                      setNotas(prev => {
                        const existe = prev.find(x => x.alunoId === nota.alunoId);

                        if (existe) {
                          // Atualiza a nota existente
                          return prev.map(x =>
                            x.alunoId === nota.alunoId ? {...x, valor: novoValor} : x
                          );
                        } else {
                          // Cria nova nota para aluno que ainda não tem
                          return [
                            ...prev,
                            {
                              id: 0, // ou null, dependendo do backend
                              alunoId: nota.alunoId,
                              alunoNome: nota.alunoNome,
                              disciplinaId: disciplina!, // garante que não é null
                              valor: novoValor,
                            }
                          ];
                        }
                      });
                    }}

                  />
                </TableCell>
                <TableCell>
                  <Button size="xs" color="blue" onClick={() => salvarNota(nota)}>
                    Salvar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhum aluno encontrado para esta disciplina.</p>
      )}
    </div>
  );
}
