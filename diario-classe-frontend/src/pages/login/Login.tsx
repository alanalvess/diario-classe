import {type ChangeEvent, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Button, Spinner} from 'flowbite-react';
import InputField from '../../components/form/InputField.tsx';
import type {UsuarioLogin} from "../../models";
import {useAuth} from "../../contexts/UseAuth.ts";

function Login() {

  const navigate = useNavigate();

  const {usuario, handleLogin, isLoading, isAuthenticated} = useAuth();
  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>({} as UsuarioLogin);

  function login(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin(usuarioLogin);
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [usuario]);

  return (
    <>
      <div className='pt-40'>

        <div className='flex justify-center lg:mx-[20vw] font-bold border-gray-200 rounded-lg lg:shadow-lg'>
          <form
            className='flex justify-center items-center flex-col w-2/3 gap-3 py-10'
            onSubmit={login}
          >
            <h2 className='text-gray-900 text-5xl '>Entrar</h2>

            <InputField
              label='E-mail'
              name='email'
              value={usuarioLogin.email}
              onChange={atualizarEstado}
              required
            />

            <InputField
              label='Senha'
              name='senha'
              type='password'
              value={usuarioLogin.senha}
              onChange={atualizarEstado}
              required
            />

            <Button type='submit'
                    className='cursor-pointer rounded bg-green-500 hover:bg-green-600 text-white w-1/2 py-2 flex justify-center focus:outline-none focus:ring-0 dark:bg-green-600 dark:hover:bg-green-700'
            >
              {isLoading ?
                <Spinner aria-label="Default status example" size='md'/>
                : <span>Entrar</span>
              }
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;