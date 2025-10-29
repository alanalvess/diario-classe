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
import {Link, NavLink} from "react-router-dom";
import {MdManageAccounts} from "react-icons/md";

export default function SidebarMenu() {
  const {usuario} = useAuth();

  if (!usuario?.roles) return null;

  function SidebarLink({ to, icon, children }) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
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
              {/* PROFESSOR */}
              {usuario.roles.includes(Roles.PROFESSOR) && (
                <>
                  <SidebarLink to="/dashboard-professor" icon={FaChartBar}>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink to="/relatoriosProfessor" icon={FaChartBar}>
                    Relatórios
                  </SidebarLink>
                  <SidebarLink to="/presenca" icon={FaClipboardCheck}>
                    Chamada
                  </SidebarLink>
                  <SidebarLink to="/notas" icon={FaClipboardList}>
                    Notas
                  </SidebarLink>
                  <SidebarLink to="/observacoes" icon={FaNoteSticky}>
                    Observações
                  </SidebarLink>
                  <SidebarLink to="/avaliacoes" icon={FaFileAlt}>
                    Avaliações
                  </SidebarLink>
                </>
              )}

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
                  <SidebarLink to="/disciplinas" icon={FaBook}>
                    Disciplinas
                  </SidebarLink>
                  <SidebarLink to="/professores" icon={FaChalkboardTeacher}>
                    Professores
                  </SidebarLink>
                  <SidebarLink to="/turmas" icon={FaUsers}>
                    Turmas
                  </SidebarLink>
                  <SidebarLink to="/alertasCoordenacao" icon={FaBell}>
                    Alertas
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
                  <Link to='/usuarios'>
                    <SidebarItem icon={MdManageAccounts}>Usuários</SidebarItem>
                  </Link>
                </>
              )}
            </SidebarItemGroup>
          </SidebarItems>
        </div>
      </Sidebar>
    </>
  )
}
