import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {jsPDF} from "jspdf";
import * as XLSX from "xlsx";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Filtro, Relatorio} from "../../../models";
import {RotatingLines} from "react-loader-spinner";

export default function RelatoriosPage() {
  const {usuario, isHydrated, isAuthenticated} = useContext(AuthContext);

  const [filtros, setFiltros] = useState<Filtro>({
    anoLetivo: new Date().getFullYear().toString(),
    turmaId: null,
    disciplinaId: null,
  });

  const [turmas, setTurmas] = useState<{ id: number; nome: string; anoLetivo: string }[]>([]);
  const [disciplinas, setDisciplinas] = useState<{ id: number; nome: string }[]>([]);
  const [professores, setProfessores] = useState<{ id: number; nome: string }[]>([]);
  const [relatorio, setRelatorio] = useState<Relatorio[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🔹 Buscar opções de filtro iniciais
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [isHydrated, isAuthenticated]);

  // 🔹 Buscar disciplinas quando seleciona uma turma
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !filtros.turmaId) {
      setDisciplinas([]);
      return;
    }

    buscar(`/disciplinas/turma/${filtros.turmaId}`, setDisciplinas, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [filtros.turmaId, isAuthenticated, isHydrated]);

  // 🔹 Gerar relatório PDF ou Excel
  async function gerarRelatorio(tipo: "pdf" | "xlsx") {
    try {
      const query = new URLSearchParams({
        tipo,
        ...(filtros.turmaId ? {turmaId: filtros.turmaId.toString()} : {}),
        ...(filtros.disciplinaId ? {disciplinaId: filtros.disciplinaId.toString()} : {}),
      });

      const response = await fetch(`http://localhost:8080/relatorios?${query.toString()}`, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });

      if (!response.ok) throw new Error("Erro ao gerar relatório");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio.${tipo}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      ToastAlerta("✅ Relatório gerado", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao gerar relatório", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Exportar PDF direto da tabela (exemplo alternativo)
  function exportarPDF() {
    const doc = new jsPDF();
    doc.text("Relatório de Alunos", 10, 10);

    relatorio.forEach((item, index) => {
      const y = 20 + index * 10;
      doc.text(
        `${item.alunoNome} | ${item.turma} | ${item.disciplina} || ""} | Nota: ${item.nota} | Freq: ${item.frequencia} | Obs: ${item.observacoes}`,
        10,
        y
      );
    });

    doc.save("relatorio_alunos.pdf");
  }

  // 🔹 Exportar Excel direto da tabela (exemplo alternativo)
  function exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(relatorio, {
      header: ["alunoNome", "turma", "disciplina", "nota", "frequencia", "observacoes"]
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, "relatorio_alunos.xlsx");
    ws["!cols"] = [
      { wch: 25 }, // Aluno
      { wch: 15 }, // Turma
      { wch: 20 }, // Disciplina
      { wch: 10 }, // Nota
      { wch: 12 }, // Frequência
      { wch: 30 }, // Observações
    ];
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Relatórios da Coordenação</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Ano Letivo"
          value={filtros.anoLetivo}
          onChange={(e) => setFiltros(prev => ({...prev, anoLetivo: e.target.value}))}
          className="border rounded p-2"
        />
        <select
          value={filtros.turmaId ?? ""}
          onChange={(e) => setFiltros(prev => ({...prev, turmaId: Number(e.target.value) || null}))}
          className="border rounded p-2"
        >
          <option value="">Todas as Turmas</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
        <select
          value={filtros.disciplinaId ?? ""}
          onChange={(e) => setFiltros(prev => ({...prev, disciplinaId: Number(e.target.value) || null}))}
          className="border rounded p-2"
        >
          <option value="">Todas as Disciplinas</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <Button onClick={() => gerarRelatorio("pdf")}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Gerar PDF</span>
          }
          </Button>
        <Button  onClick={() => gerarRelatorio("xlsx")}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Gerar Excel</span>
          }
          </Button>
      </div>

      {/* Tabela */}
      {relatorio.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Turma</TableHeadCell>
            <TableHeadCell>Disciplina</TableHeadCell>
            <TableHeadCell>Nota</TableHeadCell>
            <TableHeadCell>Frequência</TableHeadCell>
            <TableHeadCell>Observações</TableHeadCell>
          </TableHead>
          <TableBody>
            {relatorio.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.alunoNome}</TableCell>
                <TableCell>{item.turma}</TableCell>
                <TableCell>{item.disciplina}</TableCell>
                <TableCell>{item.nota}</TableCell>
                <TableCell>{item.frequencia}</TableCell>
                <TableCell>{item.observacoes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}