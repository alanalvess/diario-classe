import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, TextInput} from "flowbite-react";
import {
  FaBell,
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaChartLine, FaClipboardCheck,
  FaClipboardList,
  FaFileAlt,
  FaGraduationCap, FaMedal, FaRegClipboard, FaTachometerAlt,
  FaUsers
} from "react-icons/fa";
import {Roles} from "../../../enums/Roles.ts";
import {HiSearch} from "react-icons/hi";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaNoteSticky} from "react-icons/fa6";
import {Link} from "react-router-dom";

export default function SidebarMenu() {
  const {usuario} = useAuth();

  if (!usuario?.roles) return null;

  return (
    <>
      <Sidebar aria-label="MENU" className=" flex flex-col bg-gray-100 dark:bg-gray-800 mt-32">
        <div className="flex flex-col justify-between ">
          <SidebarItems className="overflow-y-auto h-full ">
            <form className="pb-3">
              <TextInput icon={HiSearch} type="search" placeholder="Search" required size={32}/>
            </form>

            <SidebarItemGroup>
              {/* PROFESSOR */}
              {usuario.roles.includes(Roles.PROFESSOR) && (
                <>
                  <Link to="/dashboardProfessor">
                    <SidebarItem icon={FaChartBar}>Dashboard</SidebarItem>
                  </Link>
                  <Link to="/presenca">
                    <SidebarItem icon={FaClipboardCheck}>Presença / QR</SidebarItem>
                  </Link>
                  <Link to="/notas">
                    <SidebarItem icon={FaClipboardList }>Notas</SidebarItem>
                  </Link>
                  <Link to="/observacoes">
                    <SidebarItem icon={FaNoteSticky}>Observações</SidebarItem>
                  </Link>
                  <Link to="/avaliacoes">
                    <SidebarItem icon={FaFileAlt}>Avaliações</SidebarItem>
                  </Link>
                </>
              )}

              {/* COORDENADOR */}
              {usuario.roles.includes(Roles.COORDENADOR) && (
                <>
                  <Link to="/alunos">
                    <SidebarItem icon={FaGraduationCap}>Alunos</SidebarItem>
                  </Link>
                  <Link to="/professores">
                    <SidebarItem icon={FaChalkboardTeacher}>Professores</SidebarItem>
                  </Link>
                  <Link to="/turmas">
                    <SidebarItem icon={FaUsers}>Turmas</SidebarItem>
                  </Link>
                  <Link to="/disciplinas">
                    <SidebarItem icon={FaBook}>Disciplinas</SidebarItem>
                  </Link>
                  <Link to="/dashboardCoordenacao">
                    <SidebarItem icon={FaChartBar}>Dashboard</SidebarItem>
                  </Link>
                  <Link to="/relatorios">
                    <SidebarItem icon={FaChartBar}>Relatórios</SidebarItem>
                  </Link>
                  <Link to="/alertasCoordenacao">
                    <SidebarItem icon={FaBell}>Alertas</SidebarItem>
                  </Link>
                </>
              )}

              {/* RESPONSÁVEL */}
              {usuario.roles.includes(Roles.RESPONSAVEL) && (
                <>
                  <Link to='/dashboardResponsavel'>
                    <SidebarItem icon={FaChartBar}>Dashboard</SidebarItem>
                  </Link>
                  <Link to="/boletim">
                    <SidebarItem icon={FaMedal}>Notas</SidebarItem>
                  </Link>
                  <Link to='/presencaAluno'>
                    <SidebarItem icon={FaClipboardCheck}>Presença</SidebarItem>
                  </Link>
                  <Link to='/observacoesAluno'>
                    <SidebarItem icon={FaNoteSticky}>Observações</SidebarItem>
                  </Link>
                  <Link to='/alertas'>
                    <SidebarItem icon={FaBell}>Alertas</SidebarItem>
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
