import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport
} from "@/components/ui/navigation-menu"

import { Link, MemoryRouter, useNavigate } from "react-router-dom"

import {Routing} from "./router"

import "@/style.css"
import { TooltipProvider } from "@/components/ui/tooltip"

export default () => {
  // const navigation = useNavigate()
  return (

    <div className="h-screen w-screen">
      {/* <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/">
              新流程
              </Link>
            </NavigationMenuLink>
          
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/config">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              配置
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        
        {process.env.PLASMO_PUBLIC_DEBUG_MODE==='true'&&<NavigationMenuItem>
          <Link to="/test">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              测试
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>} 

      </NavigationMenuList>
    </NavigationMenu> */}

      <MemoryRouter >
        <Routing />
      </MemoryRouter>
    </div>


    //   <RouterProvider router={router} />
    //   {process.env.PLASMO_PUBLIC_DEBUG_MODE==='true'&&<Test />}
    //   <NewWorkFlow />

  )
}
