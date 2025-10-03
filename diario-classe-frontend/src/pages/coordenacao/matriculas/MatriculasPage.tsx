import { useEffect, useState, useContext } from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {Aluno, Disciplina, Matricula, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";

// export default function MatriculasPage() {
//   const { usuario, isHydrated } = useContext(AuthContext);
//   const token = usuario.token;
//
//   const [alunos, setAlunos] = useState<Aluno[]>([]);
//   const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
//   const [turmas, setTurmas] = useState<Turma[]>([]);
//   const [matriculas, setMatriculas] = useState<Matricula[]>([]);
//
//   const [alunoId, setAlunoId] = useState<number>();
//   const [disciplinaId, setDisciplinaId] = useState<number>();
//   const [turmaId, setTurmaId] = useState<number>();
//
//   useEffect(() => {
//     if (!isHydrated || !token) return;
//     buscar("/alunos", setAlunos, { headers: { Authorization: `Bearer ${token}` } });
//     buscar("/disciplinas", setDisciplinas, { headers: { Authorization: `Bearer ${token}` } });
//     buscar("/turmas", setTurmas, { headers: { Authorization: `Bearer ${token}` } });
//     buscar("/alunos-disciplinas/turma/1", setMatriculas, { headers: { Authorization: `Bearer ${token}` } }); // exemplo turma 1
//   }, [isHydrated, token]);
//
//   async function matricular() {
//     if (!alunoId || !disciplinaId || !turmaId) {
//       ToastAlerta("⚠️ Selecione aluno, disciplina e turma", Toast.Warning);
//       return;
//     }
//
//     const body = { alunoId, disciplinaId, turmaId };
//
//     try {
//       await cadastrar("/alunos-disciplinas", body, (nova: Matricula) => {
//         setMatriculas(prev => [...prev, nova]);
//         ToastAlerta("✅ Matrícula realizada", Toast.Success);
//       }, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
//       });
//     } catch (err) {
//       ToastAlerta("Erro ao matricular", Toast.Error);
//     }
//   }
//
//   async function excluirMatricula(id: number) {
//     try {
//       await deletar(`/alunos-disciplinas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setMatriculas(prev => prev.filter(m => m.id !== id));
//       ToastAlerta("✅ Matrícula removida", Toast.Success);
//     } catch (err) {
//       ToastAlerta("Erro ao excluir matrícula", Toast.Error);
//     }
//   }
//
//   return (
//     <div className="p-6 pt-28">
//       <h1 className="text-2xl font-bold mb-6">Matrícula de Alunos em Disciplinas</h1>
//
//       {/* Formulário */}
//       <div className="flex gap-2 mb-6">
//         <select value={alunoId ?? ""} onChange={e => setAlunoId(Number(e.target.value))} className="border rounded p-2">
//           <option value="">Selecione Aluno</option>
//           {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
//         </select>
//
//         <select value={disciplinaId ?? ""} onChange={e => setDisciplinaId(Number(e.target.value))} className="border rounded p-2">
//           <option value="">Selecione Disciplina</option>
//           {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
//         </select>
//
//         <select value={turmaId ?? ""} onChange={e => setTurmaId(Number(e.target.value))} className="border rounded p-2">
//           <option value="">Selecione Turma</option>
//           {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
//         </select>
//
//         <Button color="success" onClick={matricular}>Matricular</Button>
//       </div>
//
//       {/* Tabela */}
//       {matriculas.length > 0 && (
//         <Table>
//           <TableHead>
//             <TableHeadCell>Aluno</TableHeadCell>
//             <TableHeadCell>Disciplina</TableHeadCell>
//             <TableHeadCell>Turma</TableHeadCell>
//             <TableHeadCell>Nota</TableHeadCell>
//             <TableHeadCell>Frequência</TableHeadCell>
//             <TableHeadCell>Observações</TableHeadCell>
//             <TableHeadCell>Ações</TableHeadCell>
//           </TableHead>
//           <TableBody>
//             {matriculas.map((m, i) => (
//               <TableRow key={i}>
//                 <TableCell>{m.alunoNome}</TableCell>
//                 <TableCell>{m.disciplinaNome}</TableCell>
//                 <TableCell>{m.turmaNome}</TableCell>
//                 <TableCell>{m.notaFinal ?? "-"}</TableCell>
//                 <TableCell>{m.frequencia ?? "-"}</TableCell>
//                 <TableCell>{m.observacoes ?? "-"}</TableCell>
//                 <TableCell>
//                   <Button color="failure" size="xs" onClick={() => excluirMatricula(m.id)}>Excluir</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }

// export default function MatriculasPage() {
//   const { usuario, isHydrated } = useContext(AuthContext);
//   const token = usuario.token;
//
//   const [alunos, setAlunos] = useState<Aluno[]>([]);
//   const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
//   const [turmas, setTurmas] = useState<Turma[]>([]);
//   const [matriculas, setMatriculas] = useState<Matricula[]>([]);
//
//   const [turmaId, setTurmaId] = useState<number>();
//   const [disciplinaId, setDisciplinaId] = useState<number>();
//   const [alunoId, setAlunoId] = useState<number>();
//
//   // Carrega turmas ao entrar
//   useEffect(() => {
//     if (!isHydrated || !token) return;
//     buscar("/turmas", setTurmas, { headers: { Authorization: `Bearer ${token}` } });
//     buscar("/disciplinas", setDisciplinas, { headers: { Authorization: `Bearer ${token}` } });
//     buscar("/alunos", setAlunos, { headers: { Authorization: `Bearer ${token}` } });
//   }, [isHydrated, token]);
//
//   // Carrega matrículas da turma selecionada
//   useEffect(() => {
//     if (turmaId) {
//       buscar(`/alunos-disciplinas/turma/${turmaId}`, setMatriculas, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//     } else {
//       setMatriculas([]);
//     }
//   }, [turmaId, token]);
//
//   // Filtrar alunos já matriculados na turma e disciplina
//   const alunosFiltrados = matriculas
//     .filter(m => !disciplinaId || m.disciplinaId === disciplinaId)
//     .map(m => ({ id: m.alunoId, nome: m.alunoNome }));
//
//   // Disponíveis = todos da turma que ainda não estão naquela disciplina
//   const alunosDisponiveis = turmaId
//     ? alunos.filter(a =>
//       matriculas.every(m => !(m.alunoId === a.id && m.disciplinaId === disciplinaId))
//     )
//     : [];
//
//   async function matricular() {
//     if (!alunoId || !disciplinaId || !turmaId) {
//       ToastAlerta("⚠️ Selecione turma, disciplina e aluno", Toast.Warning);
//       return;
//     }
//
//     const body = { alunoId, disciplinaId, turmaId };
//
//     try {
//       await cadastrar("/alunos-disciplinas", body, (nova: Matricula) => {
//         setMatriculas(prev => [...prev, nova]);
//         setAlunoId(undefined);
//         ToastAlerta("✅ Matrícula realizada", Toast.Success);
//       }, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
//       });
//     } catch (err) {
//       ToastAlerta("Erro ao matricular", Toast.Error);
//     }
//   }
//
//   async function excluirMatricula(id: number) {
//     try {
//       await deletar(`/alunos-disciplinas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setMatriculas(prev => prev.filter(m => m.id !== id));
//       ToastAlerta("✅ Matrícula removida", Toast.Success);
//     } catch (err) {
//       ToastAlerta("Erro ao excluir matrícula", Toast.Error);
//     }
//   }
//
//   return (
//     <div className="p-6 pt-28">
//       <h1 className="text-2xl font-bold mb-6">Matrícula de Alunos em Disciplinas</h1>
//
//       {/* Etapa 1 - Seleciona Turma */}
//       <div className="flex gap-2 mb-4">
//         <select value={turmaId ?? ""} onChange={e => setTurmaId(Number(e.target.value))} className="border rounded p-2">
//           <option value="">Selecione Turma</option>
//           {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
//         </select>
//
//         {/* Etapa 2 - Seleciona Disciplina */}
//         <select value={disciplinaId ?? ""} onChange={e => setDisciplinaId(Number(e.target.value))} className="border rounded p-2" disabled={!turmaId}>
//           <option value="">Selecione Disciplina</option>
//           {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
//         </select>
//
//         {/*// Etapa 3 - Seleciona Aluno (lista geral)*/}
//         <select
//           value={alunoId ?? ""}
//           onChange={e => setAlunoId(Number(e.target.value))}
//           className="border rounded p-2"
//           disabled={!disciplinaId || !turmaId}
//         >
//           <option value="">Selecione Aluno</option>
//           {alunos.map(a => (
//             <option key={a.id} value={a.id}>{a.nome}</option>
//           ))}
//         </select>
//
//
//         <Button color="success" onClick={matricular} disabled={!alunoId || !disciplinaId || !turmaId}>
//           Matricular
//         </Button>
//       </div>
//
//       {/* Tabela de alunos já matriculados */}
//       {matriculas.length > 0 && (
//         <Table>
//           <TableHead>
//             <TableHeadCell>Aluno</TableHeadCell>
//             <TableHeadCell>Disciplina</TableHeadCell>
//             <TableHeadCell>Turma</TableHeadCell>
//             <TableHeadCell>Ações</TableHeadCell>
//           </TableHead>
//           <TableBody>
//             {matriculas
//               .filter(m => !disciplinaId || m.disciplinaId === disciplinaId)
//               .map((m, i) => (
//                 <TableRow key={i}>
//                   <TableCell>{m.alunoNome}</TableCell>
//                   <TableCell>{m.disciplinaNome}</TableCell>
//                   <TableCell>{m.turmaNome}</TableCell>
//                   <TableCell>
//                     <Button color="failure" size="xs" onClick={() => excluirMatricula(m.id)}>Excluir</Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }


export default function MatriculasPage() {
  const { usuario, isHydrated } = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);

  // 🔹 Buscar turmas, disciplinas e alunos gerais
  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/turmas", setTurmas, { headers: { Authorization: `Bearer ${token}` } });
    buscar("/disciplinas", setDisciplinas, { headers: { Authorization: `Bearer ${token}` } });
    buscar("/alunos", setAlunos, { headers: { Authorization: `Bearer ${token}` } });
  }, [isHydrated, token]);

  // 🔹 Buscar matriculas da turma selecionada
  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/alunos-disciplinas/turma/${turmaSelecionada}`, setMatriculas, { headers: { Authorization: `Bearer ${token}` } });
  }, [turmaSelecionada, token]);

  // 🔹 Filtrar matriculas por disciplina
  const matriculasFiltradas = disciplinaSelecionada
    ? matriculas.filter(m => m.disciplinaId === disciplinaSelecionada)
    : matriculas;

  // 🔹 Matricular aluno
  async function matricularAluno() {
    if (!alunoSelecionado || !turmaSelecionada || !disciplinaSelecionada) return;

    const body = {
      alunoId: alunoSelecionado,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
    };

    try {
      await cadastrar("/alunos-disciplinas", body, (novaMatricula: Matricula) => {
        setMatriculas(prev => {
          const existe = prev.some(m =>
            m.alunoId === novaMatricula.alunoId &&
            m.turmaId === novaMatricula.turmaId &&
            m.disciplinaId === novaMatricula.disciplinaId
          );
          if (existe) return prev;
          return [...prev, novaMatricula];
        });
        setAlunoSelecionado(null);
        ToastAlerta("✅ Aluno matriculado", Toast.Success);
      }, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
    } catch {
      ToastAlerta("Erro ao matricular aluno", Toast.Error);
    }
  }

  // // 🔹 Excluir matrícula
  // async function excluirMatricula(id: number) {
  //   try {
  //     await deletar(`/alunos-disciplinas/${id}`, { Authorization: `Bearer ${token}` });
  //     setMatriculas(prev => prev.filter(m => m.id !== id));
  //     ToastAlerta("✅ Matrícula removida", Toast.Success);
  //   } catch {
  //     ToastAlerta("Erro ao remover matrícula", Toast.Error);
  //   }
  // }
    async function excluirMatricula(id: number) {
    try {
      await deletar(`/alunos-disciplinas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMatriculas(prev => prev.filter(m => m.id !== id));
      ToastAlerta("✅ Matrícula removida", Toast.Success);
    } catch (err) {
      ToastAlerta("Erro ao excluir matrícula", Toast.Error);
    }
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Matrículas de Alunos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={turmaSelecionada ?? ""} onChange={e => setTurmaSelecionada(Number(e.target.value))} className="border rounded p-2">
          <option value="">Selecione a turma</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.anoLetivo})</option>)}
        </select>

        <select value={disciplinaSelecionada ?? ""} onChange={e => setDisciplinaSelecionada(Number(e.target.value))} className="border rounded p-2">
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>

        <select value={alunoSelecionado ?? ""} onChange={e => setAlunoSelecionado(Number(e.target.value))} className="border rounded p-2">
          <option value="">Selecione o aluno</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>

        <Button color="success" onClick={matricularAluno}>Matricular</Button>
      </div>

      {/* Tabela de matriculados */}
      {matriculasFiltradas.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Turma</TableHeadCell>
            <TableHeadCell>Disciplina</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {matriculasFiltradas.map((m, i) => (
              <TableRow key={i}>
                <TableCell>{alunos.find(a => a.id === m.alunoId)?.nome || "—"}</TableCell>
                <TableCell>{turmas.find(t => t.id === m.turmaId)?.nome || "—"}</TableCell>
                <TableCell>{disciplinas.find(d => d.id === m.disciplinaId)?.nome || "—"}</TableCell>
                <TableCell>
                  <Button color="danger" size="xs" onClick={() => excluirMatricula(m.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
