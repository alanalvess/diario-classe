import {type ChangeEvent, type FormEvent, useState} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";

import type {Usuario} from "../../../models";
import {cadastrarUsuario} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {Roles} from "../../../enums/Roles.ts";
import {RotatingLines} from "react-loader-spinner";

interface CadastroProps {
  open: boolean;
  onClose: () => void;
  // onSaved: () => void;
}

function Cadastro({
                    open,
                    onClose,
                    // onSaved,
                  }: CadastroProps
) {
  // const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: "",
    email: "",
    senha: "",
    roles: [] as Roles[],
  })

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (confirmarSenha === usuario.senha && usuario.senha.length >= 8) {
      setIsLoading(true);

      try {
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario);
        ToastAlerta("Usuário cadastrado com sucesso", Toast.Success);
      } catch (error) {
        if (error instanceof Error) {
          ToastAlerta("Erro ao cadastrar usuário", Toast.Error);
        }
      } finally {
        setIsLoading(false);
      }

    } else {
      ToastAlerta("Dados inconsistentes. Verifique as informações de cadastro.", Toast.Warning);
      setUsuario({...usuario, senha: ""});
      setConfirmarSenha("");
    }

    setIsLoading(false);
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value);
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const {name, value} = e.target;

    if (name === "roles") {
      setUsuario({...usuario, roles: [value as Roles]});
    } else {
      setUsuario({...usuario, [name]: value});
    }
  }

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>



        <div className='justify-center p-4'>
          <div
            className="py-5 flex justify-center shadow-xl shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300  rounded-2xl font-bold">
            <form className="flex w-[80%] flex-col gap-4" onSubmit={cadastrarNovoUsuario}>
              <h2 className="text-slate-900 dark:text-cinza-100  text-center text-4xl">
                Cadastro
              </h2>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nome"/>
                </div>

                <TextInput
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="nome"
                  placeholder="Nome"
                  required
                  value={usuario.nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    atualizarEstado(e)
                  }
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email"/>
                </div>

                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@email.com"
                  required
                  value={usuario.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    atualizarEstado(e)
                  }
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="senha"/>
                </div>

                <TextInput
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="senha"
                  placeholder="senha"
                  required
                  value={usuario.senha}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    atualizarEstado(e)
                  }
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="confirmarSenha"/>
                </div>

                <TextInput
                  id="confirmarSenha"
                  name="confirmarSenha"
                  placeholder="confirmarSenha"
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleConfirmarSenha(e)
                  }
                />
              </div>

              {/* Tipo de Usuário */}
              <div>
                <Label htmlFor="roles"/>
                <select
                  id="roles"
                  name="roles"
                  value={usuario.roles[0] || ""}
                  onChange={atualizarEstado}
                  className="border rounded p-2 w-full"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {Object.values(Roles).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className=' mt-6'>
                {isLoading ?
                  <RotatingLines
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="24"
                    visible={true}
                  /> :
                <span>Cadastrar</span>
                 }
              </Button>
            </form>
          </div>
        </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Cadastro;
