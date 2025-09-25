"use client";

import { Link } from "@tanstack/react-router";
import { navigationItems } from "~/lib/utils.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className=" bg-dark-10 text-white">
        <div className="flex items-center gap-2 p-3">
          <img
            src="/magix-icon.svg"
            alt="Magix"
            className="size-6 group-data-[collapsible=icon]:size-2"
          />
          <h1 className="text-white text-xl font-bold group-data-[collapsible=icon]:hidden">
            Magix
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-dark-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className="flex items-center text-white"
                    >
                      <item.icon className="mr-2 h-4 w-4 text-grey-70" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
