import {useEffect, useState} from "react";
import {
  Button,
  Card,
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react";
import type {Aluno, Turma} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {LuQrCode} from "react-icons/lu";
import {IoMdPersonAdd} from "react-icons/io";
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import ResponsaveisModal from "./responsaveisModal/ResponsaveisModal.tsx";
import EditarAluno from "./editarAluno/EditarAluno.tsx";
import CadastroAluno from "./cadastroAluno/CadastroAluno.tsx";
import {useNavigate} from "react-router-dom";
import {Roles} from "../../../enums/Roles.ts";
import DeletarAluno from "./deletarAluno/DeletarAluno.tsx";
import GerarQRCode from "./gerarQRCode/GerarQRCode.tsx";

export default function AlunosPage() {
  const navigate = useNavigate();

  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalResponsavel, setModalResponsavel] = useState(false);
  const [modalEditarAluno, setModalEditarAluno] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [modalQrCode, setModalQrCode] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");

  async function buscarAlunos() {
    setIsLoading(true);
    try {
      if (turmaSelecionada) {
        // Buscar apenas alunos da turma selecionada
        await buscar(`/alunos/turma/${turmaSelecionada}`, setAlunos, {
          headers: {Authorization: `Bearer ${usuario.token}`},
        });
      } else {
        // Buscar todos os alunos
        await buscar("/alunos", setAlunos, {
          headers: {Authorization: `Bearer ${usuario.token}`},
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar alunos", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarTurmas() {
    try {
      await buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar dados", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    Promise.all([buscarTurmas(), buscarAlunos()])
      .catch((error) => console.error(error));
  }, [isHydrated, isAuthenticated]);

  useEffect(() => {
    if (!turmaSelecionada || !isHydrated) return
    buscarAlunos()
  }, [turmaSelecionada, isHydrated]);

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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Gestão de Alunos
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Gerencie todos os alunos, visualize informações e adicione novos registros facilmente.
        </p>

        <Button
          color="alternative"
          className="cursor-pointer mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"
          onClick={() => setModalCadastro(true)}
        >
          <FaPlus className="text-lg"/> Adicionar Aluno
        </Button>
      </Card>

      {/* Filtros */}
      <div className="w-full my-5">
        <Select
          id="turma"
          className="w-full"
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
        >
          <option value="">Selecione a Turma</option>
          {turmas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </Select>
      </div>


      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        <div className="w-full">
          <div
            className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="text-center font-semibold">Nome</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Matrícula</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">E-Mail</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Nascimento</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Turma</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
              </TableHead>

              <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                {alunos.length > 0 ? (
                  alunos.map((aluno, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                    >
                      <TableCell className="text-center font-medium text-gray-900 dark:text-gray-100">
                        {aluno.nome}
                      </TableCell>
                      <TableCell className="text-center">{aluno.matricula}</TableCell>
                      <TableCell className="text-center">{aluno.email}</TableCell>
                      <TableCell className="text-center">
                        {new Date(aluno.dataNascimento).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">{aluno.turmaNome}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            className="cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setAlunoSelecionado(aluno);
                              setModalQrCode(true);
                            }}
                          >
                            <LuQrCode size={18}/>
                          </Button>

                          <Button
                            className="cursor-pointer text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setAlunoSelecionado(aluno)
                              setModalResponsavel(true)
                            }}
                          >
                            <IoMdPersonAdd size={18}/>
                          </Button>
                          <Button
                            className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setAlunoSelecionado(aluno);
                              setModalEditarAluno(true);
                            }}
                          >
                            <FaEdit size={18}/>
                          </Button>
                          <Button
                            className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setAlunoSelecionado(aluno);
                              setModalExclusao(true);
                            }}
                          >
                            <FaTrashAlt size={18}/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                      Nenhum aluno cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 📱 Layout mobile */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {alunos.length > 0 ? (
              alunos.map((aluno, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {aluno.nome}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Matrícula:</span> {aluno.matricula}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Matrícula:</span> {aluno.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Nascimento:</span>{" "}
                    {new Date(aluno.dataNascimento).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Turma:</span> {aluno.turmaNome}
                  </p>

                  <div className="flex justify-around mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                    <Button
                      className="cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setAlunoSelecionado(aluno);
                        setModalQrCode(true);
                      }}
                    >
                      <LuQrCode size={20}/>
                    </Button>

                    <Button
                      className="cursor-pointer text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setAlunoSelecionado(aluno)
                        setModalResponsavel(true)
                      }}
                    >
                      <IoMdPersonAdd size={20}/>
                    </Button>

                    <Button
                      className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setAlunoSelecionado(aluno);
                        setModalEditarAluno(true);
                      }}
                    >
                      <FaEdit size={20}/>
                    </Button>

                    <Button
                      className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setAlunoSelecionado(aluno);
                        setModalExclusao(true);
                      }}
                    >
                      <FaTrashAlt size={20}/>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Card>
                <div className="text-center text-gray-500 py-4">
                  Nenhum aluno cadastrado.
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      <CadastroAluno
        open={modalCadastro}
        onClose={() => {
          setModalCadastro(false);
          setAlunoSelecionado(null);
        }}
        onSaved={buscarAlunos}
      />

      {alunoSelecionado && (
        <GerarQRCode
          open={modalQrCode}
          onClose={() => setModalQrCode(false)}
          aluno={alunoSelecionado}
        />
      )}


      {alunoSelecionado && (
        <ResponsaveisModal
          open={modalResponsavel}
          onClose={() => setModalResponsavel(false)}
          alunoSelecionado={alunoSelecionado}
        />
      )}

      {alunoSelecionado && (
        <EditarAluno
          open={modalEditarAluno}
          onClose={() => setModalEditarAluno(false)}
          onSaved={buscarAlunos}
          alunoSelecionado={alunoSelecionado}
        />
      )}

      {alunoSelecionado && (
        <DeletarAluno
          isOpen={modalExclusao}
          onClose={() => {
            setModalExclusao(false);
            setAlunoSelecionado(null);
          }}
          alunoSelecionado={alunoSelecionado}
          aoDeletar={() => buscarAlunos()}
        />
      )}
    </div>
  )
    ;
}
