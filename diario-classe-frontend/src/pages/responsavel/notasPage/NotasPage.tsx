import {
  Alert,
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
import {FaCheckCircle, FaExclamationTriangle} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import React, {useEffect, useState} from "react";
import type {Aluno, Nota, Responsavel} from "../../../models";
import {buscar} from "../../../services/Service.ts";

interface AvaliacaoAgrupada {
  nome: string;
  nota: number;
}

interface DisciplinaAgrupada {
  disciplina: string;
  avaliacoes: AvaliacaoAgrupada[];
  media: number;
}

export default function NotasPage() {
  const {usuario} = useAuth();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");
  const [notas, setNotas] = useState<Nota[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responsavel, setResponsavel] = useState<Responsavel>();

  async function buscarResponsavelPorEmail() {
    try {
      await buscar(`/responsaveis/email/${usuario.email}`, setResponsavel, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarAlunosDoResponsavel() {
    try {
      await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!usuario?.email) return;
    buscarResponsavelPorEmail();
  }, [usuario]);

  useEffect(() => {
    if (!responsavel?.email) return;
    buscarAlunosDoResponsavel();
  }, [responsavel]);

  useEffect(() => {
    if (!usuario) return;

    async function carregarAlunos() {
      try {
        await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        });
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    }

    carregarAlunos();
  }, [usuario]);

  useEffect(() => {
    if (!alunoSelecionado) return;

    async function carregarNotas() {
      setIsLoading(true);
      try {
        await buscar(`/notas/aluno/${alunoSelecionado}`, setNotas, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        });
      } catch (error) {
        console.error("Erro ao buscar notas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarNotas();
  }, [alunoSelecionado]);

  const notasAgrupadas: DisciplinaAgrupada[] = Object.values(
    notas.reduce((acc: Record<string, DisciplinaAgrupada>, nota: Nota) => {
      const disciplinaNome = nota.disciplinaNome;
      const avaliacaoTitulo = nota.avaliacaoTitulo;
      const valor = nota.valor;

      if (!acc[disciplinaNome]) {
        acc[disciplinaNome] = {disciplina: disciplinaNome, avaliacoes: [], media: 0};
      }

      acc[disciplinaNome].avaliacoes.push({nome: avaliacaoTitulo, nota: valor});
      return acc;
    }, {})
  ).map((disciplina) => {
    const soma = disciplina.avaliacoes.reduce((sum, a) => sum + a.nota, 0);
    const media = disciplina.avaliacoes.length > 0 ? soma / disciplina.avaliacoes.length : 0;
    return {...disciplina, media};
  });

  const alunoAtual = alunos.find((a) => a.id == Number(alunoSelecionado));

  function calcularSituacao(avaliacoes: { nome: string; nota: number }[]): string {
    const media =
      avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length;

    if (media >= 6) return "Aprovado";

    const provaFinal = avaliacoes.find((a) =>
      a.nome.toLowerCase().includes("final")
    );

    if (provaFinal) {
      // se já houve prova final e média < 6 → Reprovado
      return "Reprovado";
    } else {
      // ainda não houve prova final e média < 6 → Em Recuperação
      return "Em Recuperação";
    }
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Boletim Escolar
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selecione o aluno para visualizar as notas
        </p>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mt-8 mb-4 flex-grow w-full">
        <Select
          id="aluno"
          value={alunoSelecionado ?? ""}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          className="w-full"
        >
          <option value="">Selecione...</option>
          {alunos.map((aluno: Aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </Select>
      </div>

      {!alunoSelecionado ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha um aluno para visualizar seus boletim escolar.
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        alunoSelecionado &&
        alunoAtual && (
          <div className="mt-4">
            <Card className="p-4 shadow-md">
              {/* Cabeçalho */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Boletim de <span className="text-green-600 font-bold">{alunoAtual.nome}</span>
                </h2>
              </div>

              {/* 🔹 VISUALIZAÇÃO EM TABELA (DESKTOP) */}
              <div className="hidden md:block overflow-x-auto">
                <Table hoverable={true}>
                  <TableHead>
                    <TableHeadCell>Disciplina</TableHeadCell>
                    <TableHeadCell>Avaliações</TableHeadCell>
                    <TableHeadCell>Média Final</TableHeadCell>
                    <TableHeadCell>Situação</TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {notasAgrupadas.map((item, index: number) => (
                      <TableRow
                        key={index}
                        className="bg-white dark:bg-gray-700 dark:border-gray-600"
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.disciplina}
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                            {item.avaliacoes.map((a, i: number) => (
                              <li key={i}>
                                {a.nome}:{" "}
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {a.nota.toFixed(1)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="font-bold text-gray-900 dark:text-gray-100 text-center">
                          {item.media.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const situacao = calcularSituacao(item.avaliacoes);
                            switch (situacao) {
                              case "Aprovado":
                                return (
                                  <span className="flex items-center gap-2 text-green-600 font-medium">
                                    <FaCheckCircle/> Aprovado
                                  </span>
                                );
                              case "Em Recuperação":
                                return (
                                  <span className="flex items-center gap-2 text-yellow-500 font-medium">
                                    <FaExclamationTriangle/> Em Recuperação
                                  </span>
                                );
                              case "Reprovado":
                                return (
                                  <span className="flex items-center gap-2 text-red-600 font-medium">
                                    <FaExclamationTriangle/> Reprovado
                                  </span>
                                );
                            }
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 🔹 VISUALIZAÇÃO EM CARDS (MOBILE) */}
              <div className="flex flex-col gap-4 md:hidden">
                {notasAgrupadas.map((item, index: number) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.disciplina}
                      </h3>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {item.media.toFixed(1)}
                      </span>
                    </div>

                    <ul className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {item.avaliacoes.map((a, i: number) => (
                        <li key={i} className="flex justify-between">
                          <span>{a.nome}</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {a.nota.toFixed(1)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                      <span className="text-sm text-gray-500">Situação:</span>
                      {(() => {
                        const situacao = calcularSituacao(item.avaliacoes);
                        switch (situacao) {
                          case "Aprovado":
                            return (
                              <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                                <FaCheckCircle/> Aprovado
                              </span>
                            );
                          case "Em Recuperação":
                            return (
                              <span className="flex items-center gap-1 text-yellow-500 font-medium text-sm">
                                <FaExclamationTriangle/> Recuperação
                              </span>
                            );
                          case "Reprovado":
                            return (
                              <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                                <FaExclamationTriangle/> Reprovado
                              </span>
                            );
                        }
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )
      )}
    </div>
  );
}
