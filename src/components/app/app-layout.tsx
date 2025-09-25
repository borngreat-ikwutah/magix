"use client";

import * as React from "react";
import { Outlet } from "@tanstack/react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

interface AppLayoutProps {
  children?: React.ReactNode;
  breadcrumbs?: Array<{
    href?: string;
    label: string;
    current?: boolean;
  }>;
}

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-dark-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-white hover:bg-dark-25" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-grey-08" />

            {/* Breadcrumbs */}
            {breadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.label}>
                      <BreadcrumbItem>
                        {breadcrumb.current ? (
                          <BreadcrumbPage className="text-white font-medium">
                            {breadcrumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={breadcrumb.href}
                            className="text-grey-70 hover:text-white"
                          >
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="text-grey-60" />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>

          {/* Header Actions */}
          <div className="ml-auto flex items-center gap-2 px-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-grey-60" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="w-[300px] pl-8 bg-dark-25 border-grey-08 text-white placeholder:text-grey-60"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-dark-25"
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600 text-white"
              >
                2
              </Badge>
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-dark-20 min-h-screen">
          {children || <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
