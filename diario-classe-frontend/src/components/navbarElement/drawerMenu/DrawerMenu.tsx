import {
  Drawer,
  DrawerHeader,
  DrawerItems
} from 'flowbite-react'

import SidebarMenu from "../sidebarMenu/SidebarMenu.tsx";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

function DrawerMenu({open, onClose}: DrawerMenuProps) {

  return (
    <>
      <Drawer open={open} onClose={onClose}>
        <DrawerHeader title="MENU" titleIcon={() => <></>}/>
        <DrawerItems>
          <SidebarMenu />
        </DrawerItems>
      </Drawer>
    </>
  )
}

export default DrawerMenu;