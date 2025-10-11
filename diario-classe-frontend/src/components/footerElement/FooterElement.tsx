import {Footer, FooterCopyright, FooterDivider, FooterLinkGroup} from 'flowbite-react';

import {CiCalculator2} from "react-icons/ci";
import {Calculadora} from "../calculadora/Calculadora.tsx";
import {useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../../contexts/UseAuth.ts";
import {Roles} from "../../enums/Roles.ts";

function FooterElement() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const {usuario} = useAuth();

  return (
    <Footer container className='rounded-none bg-gray-300 w-full overflow-x-auto'>
      <div className='w-full px-4'>
        <div className='w-full flex flex-row justify-between items-center'>
          <FooterLinkGroup className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <Link to='/duvidas'>Dúvidas e Tutoriais</Link>
            <Link to='/sobre'>Sobre o Dia A+</Link>
            {usuario?.roles?.includes(Roles.COORDENADOR) ?
              <Link to='/cadastro'>Cadastrar Usuário</Link> : null
            }

          </FooterLinkGroup>

          <div
            className='flex items-center bg-gray-500 hover:bg-gray-600 dark:bg-gray-900 dark:hover:bg-gray-700 rounded-lg p-1'>
            <CiCalculator2
              size={30}
              onClick={() => setIsOpen(true)}
              className="cursor-pointer text-white"
            />
            <Calculadora open={isOpen} onClose={handleClose}/>
          </div>
        </div>

        <FooterDivider/>

        <div className="flex justify-center w-full">
          <Link to="/">
            <FooterCopyright
              // href='/'
              by='Dia A+™'
              year={2025}
            />
          </Link>
        </div>
      </div>
    </Footer>
  );
}

export default FooterElement;