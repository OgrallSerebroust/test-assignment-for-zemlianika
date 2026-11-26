import { Outlet } from "@tanstack/react-router";
import Menu from "@/shared/widgets/Menu";

export default function RootLayout() {
  return (<>
    <Menu />
    <Outlet />
  </>);
}