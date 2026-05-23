import React, {useEffect, useState} from "react";
import {
  Button,
  Card, Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from "flowbite-react";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaTrashAlt} from "react-icons/fa";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";
import DeletarAcesso from "./deletarAcesso/DeletarAcesso.tsx";
import type {Acesso} from "../../../models/Acesso.ts";


export default function AcessosPage() {
  const { usuario, isHydrated, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [acessos, setAcessos] = useState<Acesso[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [acessoSelecionado, setAcessoSelecionado] = useState<Acesso | null>(null);
  const [modalExclusao, setModalExclusao] = useState(false);

  const [filtroData, setFiltroData] = useState("");
  const [filtroPessoaId, setFiltroPessoaId] = useState("");
  const [filtroRole, setFiltroRole] = useState("");

  // 🔹 Buscar acessos
  // async function buscarAcessos() {
  //   setIsLoading(true);
  //   try {
  //     await buscar("/acessos/ultimos?limite=20", setAcessos, {
  //       headers: { Authorization: `Bearer ${usuario.token}` },
  //     });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       ToastAlerta("Erro ao carregar acessos", Toast.Error);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  async function buscarAcessos() {

    setIsLoading(true);

    try {

      let url = "/acessos";

      const params = new URLSearchParams();

      if (filtroData) {
        params.append("data", filtroData);
      }

      if (filtroPessoaId) {
        params.append("pessoaId", filtroPessoaId);
      }

      if (filtroRole) {
        params.append("role", filtroRole);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      } else {
        url = "/acessos/ultimos?limite=20";
      }

      await buscar(url, setAcessos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });

    } catch (error) {
      if (error instanceof Error)
        ToastAlerta("Erro ao carregar acessos", Toast.Error);
    } finally {
      setIsLoading(false);

    }
  }
  // 🔹 Dados iniciais
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    if (!usuario?.roles.includes(Roles.ADMIN)) {
      ToastAlerta("Você precisa estar autenticado como Coordenador", Toast.Info);
      navigate("/login");
      return;
    }

    buscarAcessos().then();
  }, [isHydrated, isAuthenticated, usuario]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">

      {/* TÍTULO E BOTÃO */}
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Gestão de Acessos
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Gerencie todos os acessos, visualize informações e adicione novos registros facilmente.
        </p>

      </Card>

      <Card className="mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <TextInput
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />

          {/*<TextInput*/}
          {/*  type="number"*/}
          {/*  placeholder="ID da Pessoa"*/}
          {/*  value={filtroPessoaId}*/}
          {/*  onChange={(e) => setFiltroPessoaId(e.target.value)}*/}
          {/*/>*/}

          <Select
            value={filtroRole}
            onChange={(e) => setFiltroRole(e.target.value)}
          >
            <option value="">Todas as funções</option>

            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
            <option value="RESPONSAVEL">Responsável</option>
            <option value="ADMIN">Admin</option>
            <option value="COORDENADOR">Coordenador</option>
            <option value="USER">Usuário</option>

          </Select>

          <Button color="purple" onClick={buscarAcessos}>
            Filtrar
          </Button>

        </div>

      </Card>

      {/* LISTAGEM */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        <div className="w-full">
          {/* TABELA DESKTOP */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="text-center font-semibold">Nome</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Role</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Data</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Tipo</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
              </TableHead>

              <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                {acessos.length > 0 ? (
                  acessos.map((acesso) => (
                    <TableRow key={acesso.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150">
                      <TableCell className="text-center">{acesso.nome}</TableCell>
                      <TableCell className="text-center">
                        {acesso.role ? acesso.role : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {acesso.dataHora ? new Date(acesso.dataHora).toLocaleString("pt-BR") : "-"}

                      </TableCell>
                      <TableCell className="text-center">{acesso.tipo}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => { setAcessoSelecionado(acesso); setModalExclusao(true); }}
                          >
                            <FaTrashAlt size={18}/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                      Nenhum acesso registrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* TABELA MOBILE */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {acessos.length > 0 ? (
              acessos.map((acesso) => (
                <Card key={acesso.id} className="p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{acesso.nome}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-1"><span className="font-semibold">Role:</span> {acesso.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-1"><span className="font-semibold">Tipo:</span> {acesso.tipo}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-1"><span className="font-semibold">Data:</span> {new Date(acesso.dataHora).toLocaleString()}</p>

                  <div className="flex justify-around mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                    <Button
                      className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => { setAcessoSelecionado(acesso); setModalExclusao(true); }}
                    >
                      <FaTrashAlt size={20}/>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center text-gray-500 py-4">Nenhum acesso registrado.</Card>
            )}
          </div>
        </div>
      )}

      {acessoSelecionado && (
        <DeletarAcesso
          isOpen={modalExclusao}
          onClose={() => { setModalExclusao(false); setAcessoSelecionado(null); }}
          acessoSelecionado={acessoSelecionado}
          aoDeletar={buscarAcessos}
        />
      )}
    </div>
  );
}