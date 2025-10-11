import { useState } from "react";
import {Card, Table, Select, Label, TableHead, TableHeadCell, TableBody, TableRow, TableCell} from "flowbite-react";
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";

export default function PresencaPage() {
  const { usuario } = useAuth();

  // Dados simulados
  const turmas = ["8º Ano B", "9º Ano A"];
  const disciplinas = ["Matemática", "Português", "História", "Ciências"];

  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");

  // Exemplo de registros de presença
  const presencas = [
    { data: "01/10/2025", presente: true },
    { data: "02/10/2025", presente: false },
    { data: "03/10/2025", presente: true },
    { data: "04/10/2025", presente: true },
    { data: "05/10/2025", presente: false },
    { data: "06/10/2025", presente: true },
  ];

  const totalPresencas = presencas.filter((p) => p.presente).length;
  const frequencia = ((totalPresencas / presencas.length) * 100).toFixed(1);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 mt-20 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Frequência de {usuario?.nome || "Aluno(a)"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Acompanhe as presenças e faltas nas aulas.
        </p>
      </Card>

      <Card className="p-6 mt-10 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="turma" className="mb-2 block text-sm font-medium">
              Selecione a Turma
            </Label>
            <Select
              id="turma"
              required
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
            >
              <option value="">Escolha...</option>
              {turmas.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label
              htmlFor="disciplina"
              className="mb-2 block text-sm font-medium"
            >
              Selecione a Disciplina
            </Label>
            <Select
              id="disciplina"
              required
              value={disciplinaSelecionada}
              onChange={(e) => setDisciplinaSelecionada(e.target.value)}
            >
              <option value="">Escolha...</option>
              {disciplinas.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {turmaSelecionada && disciplinaSelecionada && (
        <Card className="p-6 mt-10 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <FaCalendarCheck className="text-3xl text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Frequência em {disciplinaSelecionada}
            </h2>
          </div>

          <Table hoverable={true}>
            <TableHead>
              <TableHeadCell>Data</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {presencas.map((p, i) => (
                <TableRow
                  key={i}
                  className="bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <TableCell className="text-gray-800 dark:text-gray-100">
                    {p.data}
                  </TableCell>
                  <TableCell>
                    {p.presente ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <FaCheckCircle /> Presente
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <FaTimesCircle /> Falta
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Frequência Total:{" "}
              <span
                className={`font-bold ${
                  parseFloat(frequencia) >= 75
                    ? "text-green-600"
                    : "text-green-600"
                }`}
              >
                {frequencia}%
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              (Total de presenças: {totalPresencas} / {presencas.length})
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
