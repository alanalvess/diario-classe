import React, {useEffect, useState} from "react";
import {
  Button,
  Checkbox, Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from "flowbite-react";
import type {Disciplina, Professor, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {RotatingLines} from "react-loader-spinner";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import EditarProfessor from "./editarProfessor/EditarProfessor.tsx";
import MultiSelectDropdown from "../../../components/form/MultipleSelectDropdown.tsx";
import InputField from "../../../components/form/InputField.tsx";

export default function ProfessoresPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);
  const [turmaIdsSelecionadas, setTurmaIdsSelecionadas] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);
  const [modalEditarProfessor, setModalEditarProfessor] = useState(false);

  async function buscarProfessores() {
    try {
      await buscar("/professores", setProfessores, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar professores", Toast.Error);
      }
    }
  }

  // 🔹 Buscar dados iniciais
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscarProfessores();
    buscar("/disciplinas", setDisciplinas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [isHydrated, isAuthenticated]);

  // 🔹 Criar professor
  async function salvarProfessor() {
    if (!nome || !email || disciplinaIdsSelecionadas.length === 0) {
      ToastAlerta("⚠️ Nome, e-mail e ao menos uma disciplina são obrigatórios", Toast.Error);
      return;
    }

    const body = {
      nome,
      email,
      disciplinaIds: disciplinaIdsSelecionadas,
      turmaIds: turmaIdsSelecionadas.length > 0 ? turmaIdsSelecionadas : []
    };

    try {
      await cadastrar("/professores", body, (novoProfessor: Professor) => {
        setProfessores(prev => [...prev, novoProfessor]);
        setNome("");
        setEmail("");
        setDisciplinaIdsSelecionadas([]);
        setTurmaIdsSelecionadas([]);
        ToastAlerta("✅ Professor criado com sucesso", Toast.Success);
      }, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao criar professor", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir professor
  async function excluirProfessor(id: number) {
    try {
      await deletar(`/professores/${id}`, {headers: {Authorization: `Bearer ${usuario.token}`}});
      setProfessores(prev => prev.filter(p => p.id !== id));
      ToastAlerta("✅ Professor excluído", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir professor", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Helpers para exibir nomes
  function getDisciplinaNome(id: number) {
    return disciplinas.find(d => d.id === id)?.nome || "N/A";
  }

  function getTurmaNome(id: number) {
    return turmas.find(t => t.id === id)?.nome || "N/A";
  }

  // const toggleDisciplina = (id: number) => {
  //   setDisciplinaIdsSelecionadas(prev =>
  //     prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
  //   );
  // };
  // const toggleTurma = (id: number) => {
  //   setTurmaIdsSelecionadas(prev =>
  //     prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
  //   );
  // };

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Gestão de Professores</h1>

      {/* Formulário */}
      <div className="flex flex-col gap-2 mb-6">
        <TextInput
          type="text"
          name="nome"
          placeholder="Nome do professor"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <TextInput
          type="email"
          placeholder="E-mail do professor"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <MultiSelectDropdown
          titulo="Disciplinas *"
          opcoes={disciplinas}
          selecionados={disciplinaIdsSelecionadas}
          setSelecionados={setDisciplinaIdsSelecionadas}
        />

        <MultiSelectDropdown
          titulo="Turmas (opcional)"
          opcoes={turmas}
          selecionados={turmaIdsSelecionadas}
          setSelecionados={setTurmaIdsSelecionadas}
        />


        <Button onClick={salvarProfessor}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Adicionar Professor</span>}
        </Button>
      </div>

      {/* Tabela */}
      {professores.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Nome</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Disciplinas</TableHeadCell>
            <TableHeadCell>Turmas</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {professores.map((professor, i) => (
              <TableRow key={i}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.disciplinaIds.map(id => getDisciplinaNome(id)).join(", ")}</TableCell>
                <TableCell>{professor.turmaIds.map(id => getTurmaNome(id)).join(", ")}</TableCell>
                <TableCell>
                  <div className='flex flex-row gap-4'>
                    <Button
                      color="warning"
                      size="xs"
                      onClick={() => {
                        setProfessorSelecionado(professor)
                        setModalEditarProfessor(true);
                      }}
                      className='cursor-pointer'
                    >
                      <FaEdit size={20}/>
                    </Button>

                  <Button
                    color="failure"
                    size="xs"
                    onClick={() => excluirProfessor(professor.id)}
                  >
                    <FaTrashAlt size={20}/>
                  </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EditarProfessor
        open={modalEditarProfessor}
        onClose={() => setModalEditarProfessor(false)}
        onSaved={buscarProfessores}
        professorSelecionado={professorSelecionado}
      />
    </div>
  );
}
