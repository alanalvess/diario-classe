import {Drawer, DrawerHeader, DrawerItems} from 'flowbite-react'

import SidebarMenu from "../sidebarMenu/SidebarMenu.tsx";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

function DrawerMenu({open, onClose}: DrawerMenuProps) {

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        theme={{"root": {"base": "pl-0 dark:bg-gray-700"}}}
        className="pt-32"
      >
        {/*<DrawerHeader title="MENU" titleIcon={() => <></>} className="pl-4"/>*/}
        <DrawerItems>
            <SidebarMenu/>
        </DrawerItems>
      </Drawer>
    </>
  )
}

export default DrawerMenu;