import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import {AuthProvider} from './contexts/AuthContext';

import NavbarElement from './components/navbarElement/NavbarElement';
import FooterElement from './components/footerElement/FooterElement';

import Login from './pages/login/Login';

import Home from "./pages/home/Home.tsx";

import Admin from "./pages/usuario/admin/Admin.tsx";
import Perfil from "./pages/usuario/perfil/Perfil.tsx";
import Usuarios from "./pages/usuarios/Usuarios.tsx";
import EditarUsuario from "./pages/usuario/editarUsuario/EditarUsuario.tsx";

import FormularioUsuario from "./components/usuarios/formularioUsuario/FormularioUsuario.tsx";

import Sobre from './pages/sobre/Sobre';
import Duvidas from './pages/duvidas/Duvidas.tsx';

import Erro500 from './pages/erros/Erro500.tsx';
import Erro404 from './pages/erros/Error404.tsx';

import 'react-toastify/dist/ReactToastify.css';
import RegistroPresencaPage from "./pages/professores/registroPresenca/RegistroPresencaPage.tsx";
import RegistroNotasPage from "./pages/professores/registroNotas/RegistroNotasPage.tsx";
import AvaliacoesPage from "./pages/professores/avaliacoes/AvaliacoesPage.tsx";
import RegistroObservacoesPage from "./pages/professores/Observacoes/RegistroObservacoesPage.tsx";
import DashboardProfessorPage from "./pages/professores/dashboard/DashboardProfessorPage.tsx";

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

                                <Route path='/' element={<Home/>}/>
                                <Route path='/home' element={<Home/>}/>
                                <Route path='/presenca' element={<RegistroPresencaPage/>}/>
                                <Route path='/notas' element={<RegistroNotasPage/>}/>
                                <Route path='/avaliacoes' element={<AvaliacoesPage/>}/>
                                <Route path='/observacoes' element={<RegistroObservacoesPage/>}/>
                                <Route path='/dashboard' element={<DashboardProfessorPage/>}/>

                                <Route path='/login' element={<Login/>}/>
                                <Route path='/cadastroUsuario' element={<FormularioUsuario/>}/>

                                <Route path='/presenca' element={<RegistroPresencaPage/>}/>

                                <Route path="/perfil" element={<Perfil/>}/>
                                <Route path="/perfil/:id" element={<Perfil/>}/>

                                <Route path='/usuarios/all' element={<Usuarios/>}/>
                                <Route path='/cadastroUsuarios' element={<FormularioUsuario/>}/>
                                <Route path='/editarUsuario/:id' element={<FormularioUsuario/>}/>
                                <Route path="/editarUsuarios/:id" element={<EditarUsuario/>}/>

                                <Route path="/admin" element={<Admin/>}/>

                                <Route path='/sobre' element={<Sobre/>}/>
                                <Route path='/duvidas' element={<Duvidas/>}/>

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