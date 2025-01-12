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
import { Link, MemoryRouter, Route, Routes } from "react-router-dom"

import ConfigPanel from "./pages/ConfigPanel"
import NewWorkFlow from "./pages/NewWorkFlow"
import Test from "./pages/Test"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<NewWorkFlow />} />
    <Route path="/test" element={<Test />} />
    <Route path="/config" element={<ConfigPanel />} />
  </Routes>
)
