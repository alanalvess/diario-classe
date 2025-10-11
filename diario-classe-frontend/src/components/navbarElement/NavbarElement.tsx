import {useState} from 'react'
import {Link} from 'react-router-dom'

import Logo from '../../assets/images/dia.png'

import {Badge, Button, DarkThemeToggle, Navbar, NavbarBrand} from 'flowbite-react'
import DropdownPerfil from "./dropdownPerfil/DropdownPerfil.tsx";
import {FaBell} from "react-icons/fa";
import SidebarMenu from "./sidebarMenu/SidebarMenu.tsx";
import {GiHamburgerMenu} from "react-icons/gi";
import DrawerMenu from "./drawerMenu/DrawerMenu.tsx";
import {useAuth} from "../../contexts/UseAuth.ts";

function NavbarElement() {

  let notificationsCount: number;

  const {isAuthenticated} = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Navbar
        fluid
        className='bg-gray-800 fixed top-0 py-3 z-50 w-full justify-between'
      >
        <NavbarBrand>
          <Link to='/home' className='text-2xl font-bold uppercase'>
            <div className='flex items-center justify-center gap-3'>
              <img src={Logo} alt='Dia A+' className='max-w-30 ml-2 my-3 h-10'/>
            </div>
          </Link>
        </NavbarBrand>

        <div className="flex md:order-2 items-center space-x-4">
          {isAuthenticated ? (
            <DropdownPerfil />
          ) : (
            <Link to='/login' className='flex items-center justify-center'>
              <Button className='bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-0 cursor-pointer'>
                <span className='text-xl '>Entrar</span>
              </Button>
            </Link>
          )}
          <div className="relative flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ">
            <FaBell className="text-gray-500 text-2xl"/>
            {notificationsCount > 0 && (
              <Badge
                color="failure"
                size="sm"
                className="absolute -top-1 -right-2"
              >
                {notificationsCount}
              </Badge>
            )}
          </div>

          <DarkThemeToggle className="cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-0"/>
          {isAuthenticated && (
            <Button
              className='md:hidden text-gray-500 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-0 cursor-pointer'
              onClick={() => setIsOpen(true)}
            >
              <GiHamburgerMenu size={30}/>
            </Button>
          )}
        </div>
      </Navbar>

      <div className='md:hidden'>
        {isAuthenticated && (
          <DrawerMenu
            open={isOpen}
            onClose={handleClose}
          />
        )}
      </div>

      <div className='hidden md:flex fixed z-40 text-white rounded-none shadow-lg'>
        {isAuthenticated && (
          <SidebarMenu/>
        )}
      </div>
    </>
  )
}

export default NavbarElement;