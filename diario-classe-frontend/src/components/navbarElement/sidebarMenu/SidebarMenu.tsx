import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from "flowbite-react";
import {
  FaBell,
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaClipboardCheck,
  FaClipboardList,
  FaFileAlt,
  FaGraduationCap,
  FaMedal,
  FaUsers
} from "react-icons/fa";
import {Roles} from "../../../enums/Roles.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaNoteSticky} from "react-icons/fa6";
import {NavLink} from "react-router-dom";
import {MdManageAccounts} from "react-icons/md";

export default function SidebarMenu() {
  const {usuario} = useAuth();

  if (!usuario?.roles) return null;

  function SidebarLink({to, icon, children}) {
    return (
      <NavLink
        to={to}
        className={({isActive}) =>
          `block rounded-xl ${
            isActive
              ? "bg-gray-300 hover:bg-gray-500 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              : ""
          }`
        }
      >
        <SidebarItem className="hover:bg-gray-200" icon={icon}>{children}</SidebarItem>
      </NavLink>
    );
  }

  return (
    <>
      <Sidebar
        aria-label="MENU"
        className=" flex flex-col "
        theme={{"root": {"inner": "rounded-r-2xl rounded-l-none bg-gray-100"}}}
      >
        <div className="flex flex-col justify-between ">
          <SidebarItems className="overflow-y-auto h-full ">

            <SidebarItemGroup>
              {/* COORDENADOR */}
              {usuario.roles.includes(Roles.COORDENADOR) && (
                <>
                  <SidebarLink to="/dashboard-coordenacao" icon={FaChartBar}>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink to="/relatorios-coordenacao" icon={FaChartBar}>
                    Relatórios
                  </SidebarLink>
                  <SidebarLink to="/gestao-alunos" icon={FaGraduationCap}>
                    Alunos
                  </SidebarLink>
                  <SidebarLink to="/gestao-disciplinas" icon={FaBook}>
                    Disciplinas
                  </SidebarLink>
                  <SidebarLink to="/gestao-turmas" icon={FaUsers}>
                    Turmas
                  </SidebarLink>
                  <SidebarLink to="/gestao-professores" icon={FaChalkboardTeacher}>
                    Professores
                  </SidebarLink>
                  <SidebarLink to="/alertas-coordenacao" icon={FaBell}>
                    Alertas
                  </SidebarLink>
                </>
              )}

              {/* PROFESSOR */}
              {usuario.roles.includes(Roles.PROFESSOR) && (
                <>
                  <SidebarLink to="/dashboard-professor" icon={FaChartBar}>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink to="/relatorios-professor" icon={FaChartBar}>
                    Relatórios
                  </SidebarLink>
                  <SidebarLink to="/gestao-frequencia" icon={FaClipboardCheck}>
                    Chamada
                  </SidebarLink>
                  <SidebarLink to="/gestao-notas" icon={FaClipboardList}>
                    Notas
                  </SidebarLink>
                  <SidebarLink to="/gestao-observacoes" icon={FaNoteSticky}>
                    Observações
                  </SidebarLink>
                  <SidebarLink to="/gestao-avaliacoes" icon={FaFileAlt}>
                    Avaliações
                  </SidebarLink>
                </>
              )}

              {/* RESPONSÁVEL */}
              {usuario.roles.includes(Roles.RESPONSAVEL) && (
                <>
                  <SidebarLink to="/dashboard-responsavel" icon={FaChartBar}>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink to="/boletim-escolar" icon={FaMedal}>
                    Notas
                  </SidebarLink>
                  <SidebarLink to="/frequencia-aluno" icon={FaClipboardCheck}>
                    Frequência
                  </SidebarLink>
                  <SidebarLink to="/observacoes-aluno" icon={FaNoteSticky}>
                    Observações
                  </SidebarLink>
                  <SidebarLink to="/alertas-academicos" icon={FaBell}>
                    Alertas
                  </SidebarLink>
                </>
              )}

              {/* ADMIN */}
              {usuario.roles.includes(Roles.ADMIN) && (
                <>
                  <SidebarLink to="/usuarios" icon={MdManageAccounts}>
                    Usuários
                  </SidebarLink>
                  <SidebarLink to="/acessos" icon={MdManageAccounts}>
                    Acessos
                  </SidebarLink>
                </>
              )}
            </SidebarItemGroup>
          </SidebarItems>
        </div>
      </Sidebar>
    </>
  )
}
