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
  TableRow,
  TextInput
} from "flowbite-react";
import {buscar, cadastrar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Aluno, Avaliacao, Disciplina, Nota, Professor, Turma} from "../../../models";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";

export default function RegistroNotasPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

  const [avaliacao, setAvaliacao] = useState<number | null>(null);
  const [disciplina, setDisciplina] = useState<number | null>(null);
  const [turma, setTurma] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);


  const [professor, setProfessor] = useState<Professor>();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.PROFESSOR)) {
      ToastAlerta("Você precisa estar autenticado como Professor", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

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

  // 🔹 Buscar disciplinas da turmas selecionada
  async function buscarDisciplinas() {
    if (!turma) return;
    await buscar(`/disciplinas/turma/${turma}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }

  // 🔹 Buscar avaliações da disciplina selecionada
  // async function buscarAvaliacoes() {
  //   if (!disciplina) return;
  //   await buscar(`/avaliacoes/disciplina/${disciplina}`, setAvaliacoes, {
  //     headers: {Authorization: `Bearer ${usuario.token}`},
  //   });
  // }

  async function buscarAvaliacoes() {
    if (!turma || !disciplina) return;
    await buscar(`/avaliacoes/turma/${turma}/disciplina/${disciplina}`, setAvaliacoes, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }


  // 🔹 Buscar alunos da turma
  async function buscarAlunos() {
    if (!turma) return;
    await buscar(`/alunos/turma/${turma}`, setAlunos, {
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
      buscarAvaliacoes();
      setAvaliacao(null); // resetar avaliação ao mudar disciplina
    }
  }, [disciplina, isAuthenticated]);

  useEffect(() => {
    if (avaliacao && isAuthenticated) buscarNotas();
  }, [avaliacao, isAuthenticated]);

  useEffect(() => {
    if (turma && disciplina && avaliacao) {
      buscarAlunos().then(() => buscarNotas());
      setNotas([]);
    }
  }, [turma, disciplina, avaliacao]);

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

      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Registro de Notas
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Gerencie todos as notas de avaliações dos alunos por turma e disciplina.
        </p>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-8 mb-6">
        <Select
          className="w-full md:flex-1"
          value={turma ?? ""}
          onChange={(e) => setTurma(Number(e.target.value))}
        >
          <option value="">Selecione a turma</option>
          {turmas.map(t => (
            <option key={t.id} value={t.id}>
              {t.nome} ({t.anoLetivo})
            </option>
          ))}
        </Select>

        <Select
          className="w-full md:flex-1"
          value={disciplina ?? ""}
          onChange={(e) => setDisciplina(Number(e.target.value))}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </Select>

        <Select
          className="w-full md:flex-1"
          value={avaliacao ?? ""}
          onChange={(e) => setAvaliacao(Number(e.target.value))}
        >
          <option value="">Selecione a avaliação</option>
          {avaliacoes.map(a => (
            <option key={a.id} value={a.id}>
              {a.titulo}
            </option>
          ))}
        </Select>
      </div>

      {!turma || !disciplina || !avaliacao ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha uma turma, uma disciplina e uma avaliação para visualizar as notas dos alunos.
        </Alert>

        ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        <div className="w-full">
          <div
            className=" overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">

            <Table className="text-sm text-gray-700 dark:text-gray-300 w-full">
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="text-center font-semibold">Aluno</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Nota</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
              </TableHead>

              <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                {alunos.length > 0 ? (
                  notasComAlunos.map((nota) => (
                    <TableRow
                      key={nota.alunoId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                    >
                      {/* Nome do aluno */}
                      <TableCell className="text-center font-medium text-gray-900 dark:text-gray-100">
                        {nota.alunoNome}
                      </TableCell>

                      {/* Input de nota */}
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <TextInput
                            type="number"
                            inputMode="decimal"
                            value={nota.valor ?? ""}
                            className="w-20 text-center p-1 sm:p-2"
                            onChange={(e) => {
                              const novoValor = Number(e.target.value);
                              setNotas((prev) => {
                                const existe = prev.find((x) => x.alunoId === nota.alunoId);
                                return existe
                                  ? prev.map((x) =>
                                    x.alunoId === nota.alunoId
                                      ? { ...x, valor: novoValor }
                                      : x
                                  )
                                  : [
                                    ...prev,
                                    {
                                      id: 0,
                                      alunoId: nota.alunoId,
                                      alunoNome: nota.alunoNome,
                                      disciplinaId: disciplina!,
                                      valor: novoValor,
                                    },
                                  ];
                              });
                            }}
                          />
                        </div>
                      </TableCell>

                      {/* Botão de ação */}
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Button
                            size="xs"
                            color="alternative"
                            className="focus:outline-none focus:ring-0"
                            onClick={() => salvarNota(nota)}
                          >
                            Salvar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                      Nenhum aluno cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </div>
        </div>
      )}
    </div>

  );
}
