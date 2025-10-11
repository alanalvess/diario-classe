import { useEffect, useState } from "react";
import {Card, Table, Spinner, Badge, TableHead, TableHeadCell, TableBody, TableRow, TableCell} from "flowbite-react";
import { FaStickyNote, FaUserTie, FaBookOpen } from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {buscar} from "../../../services/Service.ts";

interface Observacao {
  id: number;
  data: string;
  disciplina: string;
  professor: string;
  conteudo: string;
  tipo?: "Elogio" | "Advertência" | "Observação";
}

export default function ObservacoesPage() {
  const { usuario, isAuthenticated} = useAuth();
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function carregarObservacoes() {
      if (!usuario?.id) return;
      setIsLoading(true);

      try {
        await buscar(`/observacoes/aluno/${usuario.id}`, setObservacoes, {
          headers: { Authorization: `Bearer ${usuario.token}` },
        });
        // setObservacoes(data || []);
      } catch (error) {
        console.error("Erro ao carregar observações:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarObservacoes();
  }, [usuario, isAuthenticated]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
    <Card className="p-6 bg-gray-100 dark:bg-gray-800 mt-20 text-center shadow-md">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
      Observações sobre {usuario?.nome || "o Aluno"}
  </h1>
  <p className="text-gray-600 dark:text-gray-400 mt-2">
    Veja os registros feitos pelos professores ao longo do período letivo.
  </p>
  </Card>

  <Card className="p-6 mt-10 shadow-md">
  <div className="flex items-center gap-3 mb-6">
  <FaStickyNote className="text-3xl text-blue-600" />
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
    Anotações Recentes
  </h2>
  </div>

  {isLoading ? (
    <div className="flex justify-center py-10">
    <Spinner size="xl" />
      </div>
  ) : observacoes.length === 0 ? (
    <p className="text-center text-gray-600 dark:text-gray-400 py-6">
      Nenhuma observação registrada até o momento.
  </p>
  ) : (
    <Table hoverable={true}>
      <TableHead>
        <TableHeadCell>Data</TableHeadCell>
      <TableHeadCell>Disciplina</TableHeadCell>
      <TableHeadCell>Professor</TableHeadCell>
      <TableHeadCell>Tipo</TableHeadCell>
      <TableHeadCell>Descrição</TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
    {observacoes.map((obs) => (
        <TableRow
          key={obs.id}
      className="bg-white dark:bg-gray-700 dark:border-gray-600"
      >
      <TableCell className="text-gray-800 dark:text-gray-100">
        {new Date(obs.data).toLocaleDateString("pt-BR")}
        </TableCell>
        <TableCell className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
      <FaBookOpen className="text-blue-600" />
        {obs.disciplina}
        </TableCell>
        <TableCell className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
      <FaUserTie className="text-gray-500" />
        {obs.professor}
        </TableCell>
        <TableCell>
        {obs.tipo === "Elogio" ? (
            <Badge color="success">Elogio</Badge>
          ) : obs.tipo === "Advertência" ? (
            <Badge color="failure">Advertência</Badge>
          ) : (
            <Badge color="info">Observação</Badge>
          )}
        </TableCell>
        <TableCell className="max-w-md text-gray-700 dark:text-gray-200">
        {obs.conteudo}
        </TableCell>
        </TableRow>
  ))}
    </TableBody>
    </Table>
  )}
  </Card>
  </div>
);
}
