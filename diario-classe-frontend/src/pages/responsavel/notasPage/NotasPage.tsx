import {Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {FaBookOpen, FaCheckCircle, FaExclamationTriangle} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {useEffect, useState} from "react";

export default function NotasPage() {
  const {usuario} = useAuth();

  // Exemplo de dados simulados
  const aluno = {
    nome: "Lucas Silva",
    turma: "8º Ano B",
    periodo: "2025 / 2º Bimestre",
  };

  const notas = [
    {
      disciplina: "Matemática",
      avaliacoes: [
        {nome: "Prova 1", nota: 8.5},
        {nome: "Trabalho", nota: 7.0},
        {nome: "Prova 2", nota: 9.0},
      ],
      media: 8.2,
    },
    {
      disciplina: "Português",
      avaliacoes: [
        {nome: "Redação", nota: 7.5},
        {nome: "Prova 1", nota: 6.8},
        {nome: "Prova 2", nota: 8.0},
      ],
      media: 7.4,
    },
    {
      disciplina: "História",
      avaliacoes: [
        {nome: "Prova 1", nota: 5.5},
        {nome: "Trabalho", nota: 6.0},
        {nome: "Prova 2", nota: 5.8},
      ],
      media: 5.8,
    },
  ];

  const [alunos, setAlunos] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Exemplo: busca os alunos do responsável logado
    fetch("/api/responsavel/alunos")
      .then((res) => res.json())
      .then(setAlunos)
      .catch(console.error);
  }, []);

  async function carregarNotas(idAluno: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notas/aluno/${idAluno}`);
      const data = await res.json();
      // setNotas(data);
    } catch (error) {
      console.error("Erro ao carregar notas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const dataGrafico = {
    labels: notas.map((n) => n.disciplina),
    datasets: [
      {
        label: "Nota Final",
        data: notas.map((n) => n),
        backgroundColor: "rgba(59,130,246,0.5)",
      },
    ],
  };

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 mt-20 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Boletim de {aluno.nome}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {aluno.turma} — {aluno.periodo}
        </p>
      </Card>

      <div className="mt-10">
        <Card className="p-4 shadow-md">
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
              {notas.map((item, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.disciplina}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      {item.avaliacoes.map((a, i) => (
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
                    {item.media >= 6 ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <FaCheckCircle/> Aprovado
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <FaExclamationTriangle/> Em Recuperação
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      
    </div>
  );
}
