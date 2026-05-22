import './App.css'
import {AuthProvider} from "./contexts/AuthProvider.tsx";
import NavbarElement from "./components/navbarElement/NavbarElement.tsx";
import Home from "./pages/home/Home.tsx";
import RegistroPresencaPage from "./pages/professores/registroPresenca/RegistroPresencaPage.tsx";
import RegistroNotasPage from "./pages/professores/registroNotas/RegistroNotasPage.tsx";
import AvaliacoesPage from "./pages/professores/avaliacoes/AvaliacoesPage.tsx";
import RegistroObservacoesPage from "./pages/professores/observacoes/RegistroObservacoesPage.tsx";
import DashboardProfessorPage from "./pages/professores/dashboard/DashboardProfessorPage.tsx";
import TurmasPage from "./pages/coordenacao/turmas/TurmasPage.tsx";
import ProfessoresPage from "./pages/coordenacao/gestaoProfessores/ProfessoresPage.tsx";
import AlunosPage from "./pages/coordenacao/alunos/AlunosPage.tsx";
import DisciplinasPage from "./pages/coordenacao/disciplinas/DisciplinasPage.tsx";
import DashboardCoordenacaoPage from "./pages/coordenacao/dashboard/DashboardCoordenacao.tsx";
import RelatoriosCoordenacao from "./pages/coordenacao/relatorios/RelatoriosCoordenacao.tsx";
import Login from "./pages/login/Login.tsx";
import Perfil from "./pages/usuario/perfil/Perfil.tsx";
import ListarUsuarios from "./pages/usuario/usuarios/ListarUsuarios.tsx";
import Sobre from "./pages/sobre/Sobre.tsx";
import Duvidas from "./pages/duvidas/Duvidas.tsx";
import Erro500 from "./pages/erros/Erro500.tsx";
import Erro404 from "./pages/erros/Error404.tsx";
import FooterElement from "./components/footerElement/FooterElement.tsx";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import NotasPage from "./pages/responsavel/notasPage/NotasPage.tsx";
import PresencaPage from "./pages/responsavel/presencaPage/PresencaPage.tsx";
import ObservacoesPage from "./pages/responsavel/observacaoPage/ObservacaoPage.tsx";
import DashboardResponsavelPage from "./pages/responsavel/dashboardResponsavel/DashboardResponsavel.tsx";
import AlertasPage from "./pages/alertas/AlertasPage.tsx";
import AlertasCoordenadorPage from "./pages/alertas/alertasCoordenador/AlertasCoordenadorPage.tsx";
import RelatoriosProfessor from "./pages/professores/relatorios/RelatoriosProfessor.tsx";
import HomePublica from "./pages/home/homePublica/HomePublica.tsx";
import AcessosPage from "./pages/usuario/gestaoAcessos/AcessosPage.tsx";

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>

          <ToastContainer/>

          <div className='min-w-full m-0 p-0  dark:bg-gray-500 min-h-screen'>

            <NavbarElement/>
            <div className='dark:bg-gray-500 min-h-[90vh]'>

              <Routes>

                <Route path='/' element={<HomePublica/>}/>
                <Route path='/home' element={<Home/>}/>

                <Route path='/dashboard-coordenacao' element={<DashboardCoordenacaoPage/>}/>
                <Route path='/relatorios-coordenacao' element={<RelatoriosCoordenacao/>}/>
                <Route path='/gestao-alunos' element={<AlunosPage/>}/>
                <Route path='/gestao-disciplinas' element={<DisciplinasPage/>}/>
                <Route path='/gestao-turmas' element={<TurmasPage/>}/>
                <Route path='/gestao-professores' element={<ProfessoresPage/>}/>
                <Route path='/alertas-coordenacao' element={<AlertasCoordenadorPage/>}/>

                <Route path='/dashboard-professor' element={<DashboardProfessorPage/>}/>
                <Route path='/relatorios-professor' element={<RelatoriosProfessor/>}/>
                <Route path='/gestao-frequencia' element={<RegistroPresencaPage/>}/>
                <Route path='/gestao-notas' element={<RegistroNotasPage/>}/>
                <Route path='/gestao-observacoes' element={<RegistroObservacoesPage/>}/>
                <Route path='/gestao-avaliacoes' element={<AvaliacoesPage/>}/>

                <Route path='/dashboard-responsavel' element={<DashboardResponsavelPage/>}/>
                <Route path='/boletim-escolar' element={<NotasPage/>}/>
                <Route path='/frequencia-aluno' element={<PresencaPage/>}/>
                <Route path='/observacoes-aluno' element={<ObservacoesPage/>}/>
                <Route path='/alertas-academicos' element={<AlertasPage/>}/>
                <Route path='/acessos' element={<AcessosPage/>}/>

                <Route path='/sobre' element={<Sobre/>}/>
                <Route path='/duvidas' element={<Duvidas/>}/>

                <Route path='/login' element={<Login/>}/>

                <Route path="/meu-perfil" element={<Perfil/>}/>
                <Route path="/usuarios" element={<ListarUsuarios/>}/>

                <Route path='/erro' element={<Erro500/>}/>
                <Route path='*' element={<Erro404/>}/>

              </Routes>
            </div>

            <div className='relative w-full '>
              <FooterElement/>
            </div>

          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
