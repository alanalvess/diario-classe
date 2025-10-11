import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo} from "../../../services/Service";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta";
import type {Usuario} from "../../../models"

import InputField from "../../../components/form/InputField.tsx";
import {useAuth} from "../../../contexts/UseAuth.ts";
import SelectField from "../../../components/form/SelectField.tsx";
import {Role} from "../../../utils/Role.ts";
import type {Roles} from "../../../enums/Roles.ts";

interface EditarUsuarioProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  usuarioSelecionado?: Usuario | null;
}

function EditarUsuario({open, onClose, onSaved, usuarioSelecionado}: EditarUsuarioProps) {
  // const navigate = useNavigate();

  const [usuarioAtualizado, setUsuarioAtualizado] = useState<Usuario>({} as Usuario);
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  // const {id} = useParams<{ id: string }>();

  // async function buscarPorId() {
  //   await buscar(`/usuarios/${usuarioAtualizado.id}`, (data: Usuario) => {
  //     setUsuarioAtualizado({...data, senha: ''});
  //   }, {
  //     headers: {
  //       Authorization: usuario.token,
  //     },
  //   })
  // }

  async function editarUsuario(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await atualizarAtributo(`/usuarios/${usuarioSelecionado.id}`, usuarioAtualizado, setUsuarioAtualizado, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });


      ToastAlerta('Usuário atualizado com sucesso', Toast.Success);
      onSaved?.();     // ✅ Atualiza a lista
      onClose?.();     // ✅ Fecha o modal
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta('O token expirou, favor logar novamente', Toast.Info);
        handleLogout();
      } else {
        ToastAlerta('Erro ao atualizar o usuário', Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUsuarioAtualizado({
      ...usuarioAtualizado,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (usuarioSelecionado) {
      setUsuarioAtualizado({ ...usuarioSelecionado, senha: '' });
    }
  }, [usuarioSelecionado, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarUsuario}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Usuário
                </h2>

                <InputField
                  label="Nome"
                  name="nome"
                  required
                  value={usuarioAtualizado.nome || ""}
                  onChange={atualizarEstado}
                />

                <InputField
                  label="Email"
                  name="email"
                  required
                  value={usuarioAtualizado.email || ""}
                  onChange={atualizarEstado}
                />

                {/*<SelectField*/}
                {/*  label="Função"*/}
                {/*  name="roles"*/}
                {/*  value={usuarioAtualizado.roles?.[0] || ""}*/}
                {/*  options={Role.map(r => ({ value: r.value, label: r.label }))} // mapeia para {value, label}*/}
                {/*  onChange={(e: ChangeEvent<HTMLSelectElement>) =>*/}
                {/*    setUsuarioAtualizado({*/}
                {/*      ...usuarioAtualizado,*/}
                {/*      roles: [e.target.value as Roles], // ✅ converte string para enum Roles*/}
                {/*    })*/}
                {/*  }*/}
                {/*/>*/}
                <SelectField
                  label="roles"
                  name="roles"
                  value={usuarioAtualizado.roles?.[0] || ""}
                  options={Role.map(r => ({ value: r.value, label: r.label }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setUsuarioAtualizado({
                      ...usuarioAtualizado,
                      roles: [e.target.value as Roles],
                    })
                  }
                />



                {/*<InputField*/}
                {/*  label="Senha"*/}
                {/*  name="senha"*/}
                {/*  type="password"*/}
                {/*  required*/}
                {/*  value={usuarioAtualizado.senha || ""}*/}
                {/*  onChange={atualizarEstado}*/}
                {/*/>*/}


                <Button type="submit" className="bg-rosa-200">
                  {isLoading ? <Spinner aria-label="Carregando"/> : <span>Salvar Alterações</span>}
                </Button>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarUsuario;

