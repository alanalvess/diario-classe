import {useEffect, useState} from "react";
import {
  Button,
  Card,
  Select,
} from "flowbite-react";

import {baixarArquivo, buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Professor, Turma} from "../../../models";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {
  FaBell,
  FaChartLine,
  FaFileExcel, FaFilePdf,
  FaUserCheck,
} from "react-icons/fa";

export default function RelatoriosProfessor() {
  const { usuario } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState("");
  const [professor, setProfessor] = useState<Professor>();

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
      // ToastAlerta("Você não tem turmas", Toast.Error)
    }
  }

  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);

  useEffect(() => {
    if (professor?.id) {
      buscarTurmas();
    }
  }, [professor]);

  async function buscarTurmas() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function handleDownload(relatorio: string, formato: "pdf" | "xlsx") {
    try {
      setIsLoading(true);

      const query = new URLSearchParams({
        relatorio,               // obrigatório pelo backend
        tipo: formato,           // pdf ou xlsx
        ...(turmaSelecionada ? { turmaId: turmaSelecionada } : {}),
        ...(periodoSelecionado ? { periodo: periodoSelecionado } : {})
      });

      await baixarArquivo(
        `/relatorios?${query.toString()}`,
        `${relatorio}.${formato}`,
        { headers: { Authorization: `Bearer ${usuario.token}` } }
      );

      ToastAlerta(`✅ Relatório ${relatorio.toUpperCase()} gerado com sucesso!`, Toast.Success);
    } catch (error) {
      console.error(error);
      ToastAlerta(`Erro ao gerar relatório ${relatorio.toUpperCase()}`, Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">

        <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            📊 Relatórios do Professor
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gere e baixe relatórios acadêmicos detalhados para análise e acompanhamento.
          </p>
        </Card>

      <div className="flex items-center gap-4 mb-4">
        <Select
          id="turma"
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
          className=" rounded-md my-4 w-full"
        >
          <option value="">Selecione...</option>
          {turmas.map((t: Turma) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </Select>
      </div>

      {/* Relatório de Frequência */}
      <Card className="my-5 p-5 shadow-md hover:shadow-lg transition">
        <div className="flex items-center gap-3 mb-3">
          <FaUserCheck className="text-blue-500 text-2xl" />
          <h3 className="text-lg font-semibold">Frequência por Turma</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Mostra a frequência individual dos alunos da turma selecionada.
        </p>
        <div className="flex gap-2">
          <Button color="red" onClick={() => handleDownload("frequencia", "pdf")} disabled={!turmaSelecionada}>
            <FaFilePdf className="mr-2" /> PDF
          </Button>
          <Button color="green" onClick={() => handleDownload("frequencia", "xlsx")} disabled={!turmaSelecionada}>
            <FaFileExcel className="mr-2" /> Excel
          </Button>
        </div>
      </Card>

      {/* Relatório de Desempenho */}
      <Card className="my-5 p-5 shadow-md hover:shadow-lg transition">
        <div className="flex items-center gap-3 mb-3">
          <FaChartLine className="text-purple-500 text-2xl" />
          <h3 className="text-lg font-semibold">Desempenho da Turma</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Mostra médias e taxas de aprovação dos alunos da turma.
        </p>
        <div className="flex gap-2">
          <Button color="red" onClick={() => handleDownload("desempenho", "pdf")} disabled={!turmaSelecionada}>
            <FaFilePdf className="mr-2" /> PDF
          </Button>
          <Button color="green" onClick={() => handleDownload("desempenho", "xlsx")} disabled={!turmaSelecionada}>
            <FaFileExcel className="mr-2" /> Excel
          </Button>
        </div>
      </Card>

      {/* Relatório de Alunos em Risco */}
      <Card className="my-5 p-5 shadow-md hover:shadow-lg transition">
        <div className="flex items-center gap-3 mb-3">
          <FaBell className="text-yellow-500 text-2xl" />
          <h3 className="text-lg font-semibold">Alunos em Risco</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Lista alunos com risco de reprovação ou evasão, baseado em alertas ativos.
        </p>
        <div className="flex gap-2">
          <Button color="red" onClick={() => handleDownload("indicadores", "pdf")}>
            <FaFilePdf className="mr-2" /> PDF
          </Button>
          <Button color="green" onClick={() => handleDownload("indicadores", "xlsx")}>
            <FaFileExcel className="mr-2" /> Excel
          </Button>
        </div>
      </Card>
      </div>
    </>
  );
}
