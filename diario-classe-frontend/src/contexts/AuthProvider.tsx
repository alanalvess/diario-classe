import {type ReactNode, useEffect, useState} from 'react'

import {Toast, ToastAlerta} from '../utils/ToastAlerta'
import {login} from '../services/Service'
import type {UsuarioLogin} from "../models";
import {jwtDecode} from "jwt-decode";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
}

export function AuthProvider({children}: AuthProviderProps) {

  const [usuario, setUsuario] = useState<UsuarioLogin | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  function isTokenValido(token: string): boolean {
    if (!token) return false;
    const raw = token.replace(/^Bearer\s+/i, "");
    try {
      const decoded = jwtDecode<JwtPayload>(raw);
      return !!decoded.exp && decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  async function handleLogin(userLogin: UsuarioLogin) {
    setIsLoading(true);
    try {
      await login(`/usuarios/logar`, userLogin, (usuarioRetornado: UsuarioLogin) => {
        if (isTokenValido(usuarioRetornado.token)) {
          setUsuario(usuarioRetornado);
          setIsAuthenticated(true);
          localStorage.setItem("usuario", JSON.stringify(usuarioRetornado));
          ToastAlerta("Seja bem-vindo!", Toast.Success);
        } else {
          ToastAlerta("Token inválido ou expirado", Toast.Warning);
        }
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        ToastAlerta("Usuário ou senha inválidos", Toast.Warning);
      } else {
        ToastAlerta("Erro inesperado ao tentar fazer login", Toast.Error);
        console.error("Erro no login:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setUsuario(null);
    setIsAuthenticated(false);
    localStorage.removeItem("usuario");
  }

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      const user = JSON.parse(usuarioSalvo) as UsuarioLogin;
      if (user?.token && isTokenValido(user.token)) {
        setUsuario(user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("usuario");
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!usuario?.token) return;

    const decoded = jwtDecode<JwtPayload>(usuario.token);
    if (!decoded.exp) return;

    const tempoRestante = decoded.exp * 1000 - Date.now();
    const timeout = setTimeout(() => {
      ToastAlerta("Sessão expirada. Faça login novamente.", Toast.Warning);
      handleLogout();
    }, tempoRestante);

    return () => clearTimeout(timeout);
  }, [usuario]);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated,
        isLoading,
        isHydrated,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
