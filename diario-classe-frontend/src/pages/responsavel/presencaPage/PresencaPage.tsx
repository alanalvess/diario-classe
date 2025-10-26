import React, {type JSX, useEffect, useState} from "react";
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
  TableRow,
  TextInput
} from "flowbite-react";
import {FaCheckCircle, FaMinusCircle, FaTimesCircle} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import type {Aluno, Presenca, Responsavel} from "../../../models";
import {buscar} from "../../../services/Service.ts";

interface DiaPresenca {
  data: string;
  diaSemana: string;
  presente?: boolean | null;
  feriado?: boolean;
  metodoChamada?: string;
  fimDeSemana?: boolean;
}

export default function PresencaPage() {
  const {usuario} = useAuth();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responsavel, setResponsavel] = useState<Responsavel>();
  const [periodo, setPeriodo] = useState<string>(new Date().toISOString().slice(0, 7)); // mês atual YYYY-MM

  const [diasMes, setDiasMes] = useState<DiaPresenca[]>([]);

  const feriados: string[] = ["2025-01-01"];

  const hoje = new Date();

  function toLocalDateString(isoYMD: string) {
    const [y, m, d] = isoYMD.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("pt-BR");
  }

  function getDiaSemanaAbreviado(isoYMD: string) {
    const nomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const [y, m, d] = isoYMD.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return nomes[date.getDay()];
  }

  async function buscarResponsavelPorEmail() {
    try {
      await buscar(`/responsaveis/email/${usuario.email}`, setResponsavel, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function buscarAlunosDoResponsavel() {
    if (!responsavel) return;
    try {
      await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function buscarPresencasDoAluno() {
    if (!alunoSelecionado) return;
    setIsLoading(true);
    try {
      await buscar(`/presencas/aluno/${alunoSelecionado}`, setPresencas, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function gerarCalendarioMes(mesAno: string): DiaPresenca[] {
    const [ano, mes] = mesAno.split("-").map(Number);
    const dias: DiaPresenca[] = [];
    const hoje = new Date();
    const ultimoDia = new Date(ano, mes, 0).getDate();

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const date = new Date(ano, mes - 1, dia);
      const diaSemana = date.getDay(); // 0-dom, 6-sáb
      const dataStr = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const fimDeSemana = diaSemana === 0 || diaSemana === 6;
      const ehFeriado = feriados.includes(dataStr);

      // Só até hoje se mês atual
      if (date <= hoje) {
        dias.push({
          data: dataStr,
          diaSemana: getDiaSemanaAbreviado(dataStr),
          fimDeSemana,
          feriado: ehFeriado,
          presente: ehFeriado ? null : undefined,
        });
      }
    }

    return dias;
  }

  useEffect(() => {
    const dias = gerarCalendarioMes(periodo);
    setDiasMes(dias);
  }, [periodo]);

  useEffect(() => {
    if (!usuario?.email) return;
    buscarResponsavelPorEmail();
  }, [usuario]);

  useEffect(() => {
    if (!responsavel?.email) return;
    buscarAlunosDoResponsavel();
  }, [responsavel]);

  useEffect(() => {
    if (!alunoSelecionado) return;
    buscarPresencasDoAluno();
  }, [alunoSelecionado]);

  const alunoAtual = alunos.find((a) => a.id == Number(alunoSelecionado));

  const presencasCompletas = diasMes.map((dia) => {
    const dataObj = new Date(dia.data);

    if (dia.feriado) {
      return {...dia, presente: null, metodoChamada: "-"};
    }
    if (dia.fimDeSemana) {
      return {...dia, presente: null, metodoChamada: "-"};
    }

    if (dataObj > hoje) {
      return {
        ...dia,
        presente: null,
        metodoChamada: "-",
      };
    }

    const presenca = presencas.find((p) => p.data === dia.data);
    return {
      ...dia,
      presente: presenca ? presenca.presente : false,
      metodoChamada: presenca ? presenca.metodoChamada : "-"
    };
  });

  const totalDiasComAula = presencasCompletas.filter((
    d) => !d.fimDeSemana && !d.feriado).length;
  const totalPresencas = presencasCompletas.filter((d) => d.presente).length;
  const frequencia = totalDiasComAula > 0 ? ((totalPresencas / totalDiasComAula) * 100).toFixed(1) : "0";

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Frequência Escolar
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Acompanhe as presenças e faltas nas aulas.
        </p>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mt-8 mb-4 justify-center">
        {/* Select do aluno */}
        <div className="flex-2 ">
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

        {/* Input de período menor */}
        <div className="flex-1 ">
          <TextInput
            name='data'
            type="Month"
            value={periodo}

            onChange={(e) => setPeriodo(e.target.value)}
          />
        </div>
      </div>


      {!alunoSelecionado ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha um aluno para visualizar sua frequência
          escolar.
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl"/>
        </div>
      ) : (
        alunoSelecionado &&
        alunoAtual && (
          <>
            <Card className="p-4 mt-4 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Calendário de Presenças</h3>

              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 text-center font-medium text-sm mb-1">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Dias */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const elementos: JSX.Element[] = [];
                  const [ano, mes] = periodo.split("-").map(Number);
                  const primeiroDiaOriginal = new Date(periodo + "-01").getDay(); // 0=domingo
                  const primeiroDia = (primeiroDiaOriginal + 1) % 7;
                  const ultimoDia = new Date(ano, mes, 0).getDate();

                  // Preenche dias vazios antes do primeiro dia
                  for (let i = 0; i < primeiroDia; i++) {
                    elementos.push(<div key={"empty-" + i} className="w-full h-8 sm:h-10"/>);
                  }

                  for (let dia = 1; dia <= ultimoDia; dia++) {
                    const dataStr = `${periodo}-${String(dia).padStart(2, "0")}`;
                    const diaObj = presencasCompletas.find((d) => d.data === dataStr);

                    let bgColor = "bg-white border border-gray-300";
                    let textColor = "text-black";

                    if (diaObj?.feriado) {
                      bgColor = "bg-gray-400";
                      textColor = "text-white";
                    } else if (diaObj?.presente) {
                      bgColor = "bg-green-500";
                      textColor = "white";
                    } else if (diaObj?.presente === false) {
                      bgColor = "bg-red-500";
                      textColor = "white";
                    } else {
                      const semana = new Date(dataStr).getDay();
                      if (semana === 5 || semana === 6) {
                        bgColor = "bg-gray-200";
                        textColor = "text-black";
                      }
                    }

                    elementos.push(
                      <div
                        key={dataStr}
                        className={`${bgColor} w-full h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-medium rounded ${textColor}`}
                        title={`${toLocalDateString(dataStr)} - ${getDiaSemanaAbreviado(dataStr)}${
                          diaObj?.feriado ? " (Feriado)" : diaObj?.presente ? " (Presente)" : diaObj?.presente === false ? " (Falta)" : ""
                        }`}
                      >
                        {dia}
                      </div>
                    );
                  }

                  return elementos;
                })()}
              </div>
            </Card>

            <div className=" mt-10 overflow-x-auto ">
              <div className="overflow-x-auto md:block">
                {/* 🧩 Visualização em cards no mobile */}
                <div className="md:hidden flex flex-col gap-3">
                  {presencasCompletas.map((p, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span className="font-medium">{toLocalDateString(p.data)}</span>
                        <span>{p.diaSemana}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {p.presente === null ? (
                            <span className="flex items-center gap-1 text-gray-500 font-medium">
                              <FaMinusCircle/>
                              {p.feriado ? "Feriado" : "Fim de Semana"}
                            </span>
                          ) : p.presente ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <FaCheckCircle/> Presente
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                              <FaTimesCircle/> Falta
                            </span>
                          )}
                        </div>

                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {p.metodoChamada}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🧾 Visualização em tabela no desktop */}
                <Table className="hidden md:table text-sm text-gray-700 dark:text-gray-300">
                  <TableHead className="bg-gray-100 dark:bg-gray-700">
                    <TableHeadCell className="text-center font-semibold">Data</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Status</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Método</TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {presencasCompletas.map((p, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                      >
                        <TableCell className="text-gray-800 dark:text-gray-100 text-center">
                          <div>
                            <span className="font-medium">{toLocalDateString(p.data)} </span>|
                            <span className="text-sm text-gray-600"> {p.diaSemana}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {p.presente === null ? (
                            <span className="flex justify-center items-center gap-2 text-gray-500 font-medium">
                              <FaMinusCircle/>
                              {p.feriado ? "Feriado" : "Fim de Semana"}
                            </span>
                          ) : p.presente ? (
                            <span className="flex justify-center items-center gap-2 text-green-600">
                              <FaCheckCircle/> Presente
                            </span>
                          ) : (
                            <span className="flex justify-center items-center gap-2 text-red-600">
                              <FaTimesCircle/> Falta
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-gray-800 dark:text-gray-100">
                          {p.metodoChamada}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Card className="text-gray-700 dark:text-gray-300 mt-6">
              <div className="mt-6 text-center">
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Frequência Total: <span className="font-bold text-green-600">{frequencia}%</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  (Total de presenças: {totalPresencas} / {totalDiasComAula})
                </p>
              </div>
            </Card>
          </>
        )
      )}
    </div>
  );
}
