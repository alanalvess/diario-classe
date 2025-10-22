import {Card, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {FaBookOpen, FaCheckCircle, FaExclamationTriangle} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {useEffect, useState} from "react";
import SelectField from "../../../components/form/SelectField.tsx";
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
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Boletim Escolar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selecione o aluno para visualizar as notas
        </p>
      </Card>

      <div className="mt-8 flex justify-center">
        <SelectField
          label="Aluno"
          name="aluno"
          required
          value={alunoSelecionado}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          options={alunos.map((a) => ({
            value: a.id.toString(), // garante que o valor é string
            label: a.nome,
          }))}
          // className="w-80"
        />
      </div>


      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        alunoSelecionado &&
        alunoAtual && (
          <div className="mt-10">
            <Card className="p-4 shadow-md">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Boletim de {alunoAtual.nome}
                </h2>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <FaBookOpen className="text-3xl text-blue-600"/>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Desempenho por Disciplina
                </h2>
              </div>

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
                      <TableCell className="font-bold text-gray-900 dark:text-gray-100">
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
            </Card>
          </div>
        )
      )}
    </div>
  );
}
