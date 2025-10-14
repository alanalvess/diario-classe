import {useEffect, useState} from "react";
import {
  Badge,
  Button,
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
import {FaEdit, FaPlus, FaSearch, FaTrash} from "react-icons/fa";
import Cadastro from "../cadastro/Cadastro.tsx";
import EditarUsuario from "../editarUsuario/EditarUsuario.tsx";
import DeletarUsuario from "../deletarUsuario/DeletarUsuario.tsx";

function ListarUsuarios() {

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

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
            <Button color="success" onClick={() => setModalCadastro(true)}>
              <FaPlus className="mr-2"/> Novo Usuário
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <TextInput
              type="text"
              placeholder="Buscar por nome"
              value={busca}
              icon={FaSearch}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Button onClick={buscarPorNome}>Buscar</Button>
          </div>

          {/* 🧾 Tabela */}
          <div className="overflow-x-auto mt-4">
            <Table hoverable={true}>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Nome</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Funções</TableHeadCell>
                  <TableHeadCell>Ações</TableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody className="divide-y">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : usuarios.length === 0 ? (
                  <TableRow>

                    <TableCell colSpan={4} className="text-center py-6">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>

                ) : (
                  usuarios.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.nome}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        {u.roles.map((role) => (
                          <Badge key={role} color="info" className="mr-1">
                            {role}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          color="info"
                          size="xs"
                          onClick={() => {
                            setUsuarioSelecionado(u);
                            setModalEdicao(true);
                          }}
                        >
                          <FaEdit/>
                        </Button>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => {
                            setUsuarioSelecionado(u);
                            setModalExclusao(true);
                          }}
                        >
                          <FaTrash/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Cadastro
            open={modalCadastro}
            onClose={() => {
              setModalCadastro(false);
              setUsuarioSelecionado(null);
            }}
            onSaved={listarUsuarios}
          />

          <EditarUsuario
            open={modalEdicao}
            onClose={() => {
              setModalEdicao(false);
              setUsuarioSelecionado(null);
            }}
            usuarioSelecionado={usuarioSelecionado}
            onSaved={listarUsuarios}
          />

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
      </div>
    </>
  );
}

export default ListarUsuarios;
