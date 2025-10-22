import React, {useEffect, useState} from "react";
import {Button, Card, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import type {Disciplina, Professor, Turma} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import EditarProfessor from "./editarProfessor/EditarProfessor.tsx";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";
import CadastroProfessor from "./cadastroProfessor/CadastroProfessor.tsx";
import DeletarProfessor from "./deletarProfessor/DeletarProfessor.tsx";

export default function ProfessoresPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);

  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalEditarProfessor, setModalEditarProfessor] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);

  async function buscarProfessores() {
    setIsLoading(true);
    try {
      await buscar("/professores", setProfessores, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar professores", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarDisciplinas() {
    try {
      await buscar("/disciplinas", setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar disciplinas", Toast.Error);
      }
    }
  }

  async function buscarTurmas() {
    try {
      await buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar turmas", Toast.Error);
      }
    }
  }

  // 🔹 Buscar dados iniciais
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscarProfessores();
    buscarDisciplinas()
    buscarTurmas()
  }, [isHydrated, isAuthenticated]);

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


      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        <div className="w-full">
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="text-center font-semibold">Nome</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Email</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Disciplinas</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Turmas</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
              </TableHead>

              <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                {professores.length > 0 ? (
                  professores.map((professor, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                    >
                      <TableCell
                        className="text-center font-medium text-gray-900 dark:text-gray-100">{professor.nome}</TableCell>
                      <TableCell className="text-center">{professor.email}</TableCell>
                      <TableCell className="text-center">
                        {professor.disciplinaNomes.map((nome, index) => (
                          <div key={index}>{nome}</div>
                        ))}
                      </TableCell>
                      <TableCell className="text-center">
                        {professor.turmaNomes.map((nome, index) => (
                          <div key={index}>{nome}</div>
                        ))}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setProfessorSelecionado(professor);
                              setModalEditarProfessor(true);
                            }}
                          >
                            <FaEdit size={18}/>
                          </Button>

                          <Button
                            className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setProfessorSelecionado(professor)
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
                    <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                      Nenhum aluno cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden flex flex-col gap-4 mt-4">
            {professores.length > 0 ? (
              professores.map((professor, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {professor.nome}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
                    <span className="font-semibold">E-Mail:</span> {professor.email}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400py-2">
                    <span className="font-semibold">Disciplinas:</span>
                    {professor.disciplinaNomes.map((nome, index) => (
                      <div key={index}><span>-</span>{nome}</div>
                    ))}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
                    <span className="font-semibold">Turmas:</span>
                    {professor.turmaNomes.map((nome, index) => (
                      <div key={index}><span>-</span>{nome}</div>
                    ))}
                  </p>

                  <div className="flex justify-around mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                    <Button
                      className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setProfessorSelecionado(professor);
                        setModalEditarProfessor(true);
                      }}
                    >
                      <FaEdit size={20}/>
                    </Button>

                    <Button
                      className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setProfessorSelecionado(professor);
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
                  Nenhum responsável cadastrado.
                </div>
              </Card>
            )}
          </div>
        </div>
      )}


      <CadastroProfessor
        open={modalCadastro}
        onClose={() => {
          setModalCadastro(false);
          setProfessorSelecionado(null);
        }}
        onSaved={buscarProfessores}
      />

      {professorSelecionado && (
        <EditarProfessor
          open={modalEditarProfessor}
          onClose={() => setModalEditarProfessor(false)}
          onSaved={buscarProfessores}
          professorSelecionado={professorSelecionado}
        />
      )}

      {professorSelecionado && (
        <DeletarProfessor
          isOpen={modalExclusao}
          onClose={() => {
            setModalExclusao(false);
            setProfessorSelecionado(null);
          }}
          professorSelecionado={professorSelecionado}
          aoDeletar={() => buscarProfessores()}
        />
      )}
    </div>
  );
}
