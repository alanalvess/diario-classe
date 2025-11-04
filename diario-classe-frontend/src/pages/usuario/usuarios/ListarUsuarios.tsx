import React, {useEffect, useState} from "react";
import {
  Badge,
  Button,
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from "flowbite-react";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {buscar} from "../../../services/Service.ts";
import type {Usuario} from "../../../models"
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaEdit, FaPlus, FaSearch, FaTrashAlt} from "react-icons/fa";
import Cadastro from "../cadastro/Cadastro.tsx";
import EditarUsuario from "../editarUsuario/EditarUsuario.tsx";
import DeletarUsuario from "../deletarUsuario/DeletarUsuario.tsx";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";

function ListarUsuarios() {

  const navigate = useNavigate();

  const {usuario, isAuthenticated, isHydrated} = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function listarUsuarios() {
    try {
      await buscar("/usuarios/all", setUsuarios, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar usuários", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarPorNome() {
    if (!busca.trim()) return listarUsuarios();
    try {
      await buscar(`/usuarios/buscar/${busca}`, setUsuarios, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch {
      ToastAlerta("Usuário não encontrado", Toast.Warning);
    }
  }

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    listarUsuarios();
  }, [isHydrated, isAuthenticated]);

  const temPermissao = usuario?.roles.some(
    (role) => role === Roles.COORDENADOR || role === Roles.ADMIN
  );

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !temPermissao) {
      ToastAlerta("Você precisa estar autenticado como Coordenador ou Admin", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
        <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Gestão de Usuários
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Gerencie todos os usuários, autorize ou revogue o acesso de professores e responsáveis pelos alunos, bem
            como de outros coordenadores.
          </p>

          <Button
            color="alternative"
            className="cursor-pointer mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"
            onClick={() => setModalCadastro(true)}
          >
            <FaPlus className="text-lg"/> Adicionar Novo Usuário
          </Button>
        </Card>

        <div className="relative w-full mb-6">
          <TextInput
            type="text"
            placeholder="Buscar por nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarPorNome()}
            className="w-full"
          />

          <button
            onClick={buscarPorNome}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <FaSearch size={18}/>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-10">
            <Spinner size="xl" color="purple"/>
          </div>
        ) : (
          <div className="w-full">
            <div
              className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              {/* 🧾 Tabela - visível apenas em telas médias pra cima */}
              <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
                <TableHead className="bg-gray-100 dark:bg-gray-700">
                  <TableRow>
                    <TableHeadCell className="text-center font-semibold">Nome</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Email</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Funções</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
                  </TableRow>
                </TableHead>

                <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {usuarios.length > 0 ? (
                    usuarios.map((u) => (
                      <TableRow
                        key={u.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                      >
                        <TableCell
                          className="text-center font-medium text-gray-900 dark:text-gray-100">{u.nome}</TableCell>
                        <TableCell className="text-center">{u.email}</TableCell>
                        <TableCell className="text-center">
                          {u.roles.map((role) => (
                            <Badge key={role} color="info" className="mr-1 flex justify-center">
                              {role}
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Button
                              className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                              color="alternative"
                              size="xs"
                              onClick={() => {
                                setUsuarioSelecionado(u);
                                setModalEdicao(true);
                              }}
                            >
                              <FaEdit size={18}/>
                            </Button>
                            <Button
                              className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                              color="alternative"
                              size="xs"
                              onClick={() => {
                                setUsuarioSelecionado(u);
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
                        Nenhum usuário cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden flex flex-col gap-4 mt-4">
              {usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <Card
                    key={u.id}
                    className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {/* Cabeçalho */}
                    <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {u.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {u.email}
                      </p>
                    </div>

                    {/* Funções */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {u.roles.map((role) => (
                          <Badge key={role} color="info" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex flex-wrap justify-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                        color="alternative"
                        size="xs"
                        onClick={() => {
                          setUsuarioSelecionado(u);
                          setModalEdicao(true);
                        }}
                      >
                        <FaEdit size={20}/>
                      </Button>

                      <Button
                        className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                        color="alternative"
                        size="xs"
                        onClick={() => {
                          setUsuarioSelecionado(u);
                          setModalExclusao(true);
                        }}
                      >
                        <FaTrashAlt size={20}/>
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <div className="text-center text-gray-500 py-4">
                    Nenhum usuário cadastrado.
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        <Cadastro
          open={modalCadastro}
          onClose={() => {
            setModalCadastro(false);
            setUsuarioSelecionado(null);
          }}
          onSaved={listarUsuarios}
        />

        {usuarioSelecionado && (

        <EditarUsuario
          open={modalEdicao}
          onClose={() => {
            setModalEdicao(false);
            setUsuarioSelecionado(null);
          }}
          usuarioSelecionado={usuarioSelecionado}
          onSaved={listarUsuarios}
        />
        )}

        {usuarioSelecionado && (
          <DeletarUsuario
            isOpen={modalExclusao}
            onClose={() => {
              setModalExclusao(false);
              setUsuarioSelecionado(null);
            }}
            usuarioSelecionado={usuarioSelecionado}
            aoDeletar={() => listarUsuarios()}
          />
        )}

      </div>
      {/*</div>*/}
    </>
  );
}

export default ListarUsuarios;
