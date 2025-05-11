import * as React from "react";
import { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "@/hooks/useAuth";
const NavDocuments = lazy(() => import("@/components/nav-documents"));
const NavMain = lazy(() => import("@/components/nav-main"));
const NavSecondary = lazy(() => import("@/components/nav-secondary"));
const NavUser = lazy(() => import("@/components/nav-user"));

import { IconInnerShadowTop } from "@tabler/icons-react";
import { adminData } from "@/pages/dashboard/app-dashboard/admin-data";
import { userData } from "@/pages/dashboard/app-dashboard/user-data";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import ShimmerLoader from "./loadings.tsx/ShimmerLoader";
import { Link } from "react-router-dom";
import { UrlPage } from "@/router/RouterTypes";

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userRole } = useAuth();
  const [data, setData] = useState<any>(null);
  const dashboardRoute = UrlPage.find(route => route.name === "Dashboard");

  useEffect(() => {
    if (userRole === "admin") {
      setData(adminData);
    } else if (userRole === "user") {
      setData(userData);
    }
  }, [userRole]);

  if (!data) {
    return <div>Cargando...</div>; // Mostrar mientras se cargan los datos
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to={`${dashboardRoute?.url}`}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">LAPIN</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<div className="w-full h-full"><ShimmerLoader/></div>}>
          <NavMain items={data.navMain} />
          <NavDocuments items={data.documents} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div className="w-full h-[50px]"><ShimmerLoader/></div>}>
          <NavUser user={data.user} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
