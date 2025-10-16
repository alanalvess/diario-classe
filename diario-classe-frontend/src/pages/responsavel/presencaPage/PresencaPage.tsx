import {type JSX, useEffect, useState} from "react";
import {Card, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {FaCheckCircle, FaMinusCircle, FaTimesCircle} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import type {Aluno, Presenca, Responsavel} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import SelectField from "../../../components/form/SelectField.tsx";
import InputField from "../../../components/form/InputField.tsx";

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
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Frequência de {usuario?.nome || "Aluno(a)"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Acompanhe as presenças e faltas nas aulas.
        </p>
      </Card>

      <div className="mt-8 flex flex-wrap items-end gap-4 justify-center">
        {/* Select do aluno */}
        <div className="flex-1 min-w-[200px]">
          <SelectField
            label="Aluno"
            name="aluno"
            value={alunoSelecionado}
            onChange={(e) => setAlunoSelecionado(e.target.value)}
            options={alunos.map((a) => ({ value: a.id.toString(), label: a.nome }))}
          />
        </div>

        {/* Input de período menor */}
        <div className="w-60">
          <InputField
            label="Período"
            name='data'
            type="Month"
            value={periodo}

            onChange={(e) => setPeriodo(e.target.value)}
          />
          {/*<label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">*/}
          {/*  Período*/}
          {/*</label>*/}
          {/*<input*/}
          {/*  type="month"*/}
          {/*  value={periodo}*/}
          {/*  onChange={(e) => setPeriodo(e.target.value)}*/}
          {/*  className="w-full border p-2 rounded"*/}
          {/*/>*/}
        </div>
      </div>


      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl"/>
        </div>
      ) : (
        alunoSelecionado &&
        alunoAtual && (
          <>
            <Card className="p-4 mt-6 shadow-md">
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
                    elementos.push(<div key={"empty-" + i} className="w-full h-8 sm:h-10" />);
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

            <Card className="p-6 mt-10 shadow-md">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Data</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Método</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {presencasCompletas.map((p, i) => (
                    <TableRow key={i} className="bg-white dark:bg-gray-700 dark:border-gray-600">
                      <TableCell className="text-gray-800 dark:text-gray-100">
                        <div>
                          <span className="font-medium">{toLocalDateString(p.data)} </span>|
                          <span className="text-sm text-gray-600"> {p.diaSemana}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.presente === null ? (
                          <span
                            className="flex items-center gap-2 text-gray-500 font-medium">
                            <FaMinusCircle />
                            {p.feriado ? "Feriado" : "Fim de Semana"}
                          </span>
                        ) : p.presente ? (
                          <span className="flex items-center gap-2 text-green-600"><FaCheckCircle/> Presente</span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-600"><FaTimesCircle/> Falta</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-100">{p.metodoChamada}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
