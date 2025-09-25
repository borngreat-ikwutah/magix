import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "~/components/app/app-layout";

function AppLayoutWrapper() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export const Route = createFileRoute("/app")({
  component: AppLayoutWrapper,
});
