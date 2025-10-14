import {useEffect, useState} from 'react';
import {Avatar, Button, Card, Spinner} from 'flowbite-react';
import {useAuth} from "../../../contexts/UseAuth.ts";
import UserImg from "../../../assets/images/user.png"
import {Link, useParams} from "react-router-dom";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Usuario} from "../../../models";
import EditarMeuUsuario from "./editarMeuUsuario/EditarMeuUsuario.tsx";
import AlterarSenha from "./alterarSenha/alterarSenha.tsx";
import {FaKey, FaUserEdit} from "react-icons/fa";

export default function Perfil() {

  const { usuario, isHydrated } = useAuth();
  const id = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [dadosUsuario, setDadosUsuario] = useState<Usuario | null>(null);

  const [openEditar, setOpenEditar] = useState(false);
  const [openSenha, setOpenSenha] = useState(false);

  async function buscarUsuario() {
    try {
      setIsLoading(true);
      await buscar(`/usuarios/${id?.id}`, setDadosUsuario, {
        headers: { Authorization: `Bearer ${usuario?.token}` },
      });
    } catch (error) {
      if (error instanceof Error) return;
      ToastAlerta("Erro ao buscar usuário", Toast.Info);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isHydrated && usuario && id?.id) {
      buscarUsuario();
    }
  }, [isHydrated, usuario, id]);

  // 🔹 Evita erro ao acessar `usuario` antes de carregar
  if (!isHydrated || !usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  const user = dadosUsuario ?? usuario;

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Perfil</h1>

          <div className="flex items-center gap-4">
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setOpenEditar(true)}
                className='bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600'
              >
                <FaUserEdit className="mr-2" /> Editar Dados
              </Button>
              <Button
                onClick={() => setOpenSenha(true)}
                className='bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600'
              >
                <FaKey className="mr-2" /> Alterar Senha
              </Button>
            </div>
            {/*<Link*/}
            {/*  to={`/editarUsuario/${usuario?.id}`}*/}
            {/*  className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400"*/}
            {/*>*/}
            {/*  Editar Meu Perfil*/}
            {/*</Link>*/}
          </div>
        </div>

        {isLoading ? (
          <Spinner aria-label="Default status example"/>
        ) : (
          <Card className="p-0 overflow-x-auto">
            <div className="flex flex-col items-center text-center">
              <Avatar img={UserImg} alt="Foto do usuário" rounded size="xl"/>
              <h2 className="text-xl font-semibold mt-4">{user?.nome}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="mt-2 inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {user?.roles?.join(", ")}
            </span>
            </div>
          </Card>
        )}
      </div>
      <EditarMeuUsuario
        show={openEditar}
        onClose={() => setOpenEditar(false)}
        usuarioSelecionado={dadosUsuario}
        onSaved={() => buscarUsuario()}
      />

      <AlterarSenha
        show={openSenha}
        onClose={() => setOpenSenha(false)}
      />
    </>
  )
}
