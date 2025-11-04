import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Spinner} from 'flowbite-react';
import {useAuth} from "../../../contexts/UseAuth.ts";
import UserImg from "../../../assets/images/user.png"
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Usuario} from "../../../models";
import EditarMeuUsuario from "./editarMeuUsuario/EditarMeuUsuario.tsx";
import AlterarSenha from "./alterarSenha/alterarSenha.tsx";
import {FaKey, FaUserEdit} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export default function Perfil() {

  const {usuario, isHydrated, isAuthenticated} = useAuth();
  const navigate = useNavigate();
  // const id = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [dadosUsuario, setDadosUsuario] = useState<Usuario | null>(null);

  const [openEditar, setOpenEditar] = useState(false);
  const [openSenha, setOpenSenha] = useState(false);


  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      ToastAlerta("Você precisa estar autenticado", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated]);

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }


  async function buscarUsuario() {
    try {
      setIsLoading(true);
      await buscar(`/usuarios/${usuario.id}`, setDadosUsuario, {
        headers: {Authorization: `Bearer ${usuario?.token}`},
      });
    } catch (error) {
      if (error instanceof Error) return;
      ToastAlerta("Erro ao buscar usuário", Toast.Info);
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   if (isHydrated && usuario.id) {
  //     buscarUsuario();
  //   }
  // }, [isHydrated]);

  // 🔹 Evita erro ao acessar `usuario` antes de carregar
  // if (!isHydrated || !usuario) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <Spinner size="xl"/>
  //     </div>
  //   );
  // }

  const user = dadosUsuario ?? usuario;

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
        <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Perfil de Usuário
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Gerencie seus dados e altere a senha.
          </p>

          {/*<Button*/}
          {/*  color="alternative"*/}
          {/*  className="cursor-pointer mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"*/}
          {/*  onClick={() => setModalCadastro(true)}*/}
          {/*>*/}
          {/*  <FaPlus className="text-lg"/> Adicionar Professor*/}
          {/*</Button>*/}
          <div className="flex gap-3 mt-6 w-full">
            <Button
              color="alternative"
              onClick={() => setOpenEditar(true)}
              className='cursor-pointer w-full focus:outline-none focus:ring-0'
            >
              <FaUserEdit className="mr-2" size={20}/> Editar Dados
            </Button>
            <Button
              color="alternative"
              onClick={() => setOpenSenha(true)}
              className='cursor-pointer w-full focus:outline-none focus:ring-0'
            >
              <FaKey className="mr-2"/> Alterar Senha
            </Button>
          </div>
        </Card>

        {isLoading ? (
          <Spinner size="xl" color="purple"/>
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
