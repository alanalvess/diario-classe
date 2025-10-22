import React, {useEffect, useState} from "react";
import {
  Button, Card,
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
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import EditarProfessor from "./editarProfessor/EditarProfessor.tsx";
import MultiSelectDropdown from "../../../components/form/MultipleSelectDropdown.tsx";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";
import CadastroProfessor from "./cadastroProfessor/CadastroProfessor.tsx";

export default function ProfessoresPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();
  const navigate = useNavigate();

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

  const [modalCadastro, setModalCadastro] = useState(false);


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

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.COORDENADOR)) {
      ToastAlerta("Você precisa estar autenticado como Coordenador", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Gestão de Professores
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Gerencie todos os professores, visualize informações e adicione novos registros facilmente.
        </p>

        <Button
          color="alternative"
          className="cursor-pointer mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"
          onClick={() => setModalCadastro(true)}
        >
          <FaPlus className="text-lg"/> Adicionar Professor
        </Button>
      </Card>

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
                <TableCell>{professor.disciplinaNomes.map(nome => (nome)).join(", ")}</TableCell>
                <TableCell>{professor.turmaNomes.map(nome => (nome)).join(", ")}</TableCell>
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

      <CadastroProfessor
        open={modalCadastro}
        onClose={() => {
          setModalCadastro(false);
          setProfessorSelecionado(null);
        }}
        onSaved={buscarProfessores}
      />

      <EditarProfessor
        open={modalEditarProfessor}
        onClose={() => setModalEditarProfessor(false)}
        onSaved={buscarProfessores}
        professorSelecionado={professorSelecionado}
      />
    </div>
  );
}
