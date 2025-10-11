import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const cadastrarUsuario = async <T>(
  url: string,
  dados: object,
  setDados: (dados: T) => void
) => {
    const resposta = await api.post(url, dados);
    setDados(resposta.data);
}

export const login = async <T>(
  url: string,
  dados: object,
  setDados: (dados: T) => void
) => {
    const resposta = await api.post(url, dados);
    setDados(resposta.data);
}

export const buscar = async <T>(
  url: string,
  setDados: (dados: T) => void,
  header?: object
) => {
    const resposta = await api.get(url, header);
    setDados(resposta.data);
}

export const cadastrar = async <T>(
  url: string,
  dados: object,
  setDados: (dados: T) => void,
  header: object
) => {
    const resposta = await api.post(url, dados, header);
    setDados(resposta.data);
}

export const atualizar = async <T>(
  url: string,
  dados: object,
  setDados: (dados: T) => void,
  header: object
) => {
    const resposta = await api.put(url, dados, header);
    setDados(resposta.data);
}

export const atualizarAtributo = async <T>(
  url: string,
  dados: object,
  setDados: (dados: T) => void,
  header: object
) => {
    const resposta = await api.patch(url, dados, header);
    setDados(resposta.data);
}

export const deletar = async (url: string, header: object) => {
    await api.delete(url, header);
}

// 🔹 service.ts
export const registrarPresencaQRCode = async (
  url: string,
  dados: Record<string, string>,
  header: object
) => {
    const resposta = await api.post(url, new URLSearchParams(dados), header);
    return resposta.data;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                window.location.href = '/erro';
            }
        }
        return Promise.reject(error);
    }
);