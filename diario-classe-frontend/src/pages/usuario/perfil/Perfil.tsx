import {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Avatar, Card, Spinner} from 'flowbite-react';

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';

import type {Usuario} from "../../../models"
import {buscar} from "../../../services/Service.ts";
import UserImg from "../../../assets/images/user.png"

export default function Perfil() {

    const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
    const id = useParams<{ id: string }>();

    const [isLoading, setIsLoading] = useState(true);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    async function buscarUsuario() {
        try {
            setIsLoading(true);
            await buscar(`/usuarios/${id}`, setUsuarios, {headers: {Authorization: usuario.token}});
        } catch (error) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta("Erro ao buscar usuário", Toast.Info);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isHydrated && id) {
            buscarUsuario();
        }
    }, [isHydrated, id]);

    return (
        <>
            <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">

                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Perfil</h1>

                    <div className="flex items-center gap-4">
                        <Link to={`/editarUsuario/${usuario.id}`}
                              className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                            Editar Meu Perfil
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <Spinner aria-label="Default status example"/>
                ) : (
                    <Card className="p-0 overflow-x-auto">
                        <div className="flex flex-col items-center text-center">
                            <Avatar img={UserImg} alt="Foto do usuário" rounded size="xl"/>
                            <h2 className="text-xl font-semibold mt-4">{usuario.nome}</h2>
                            <p className="text-sm text-gray-500">{usuario.email}</p>
                            <span
                                className="mt-2 inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                {usuario.roles}
                            </span>
                        </div>
                    </Card>
                )}
            </div>
        </>
    )
}
