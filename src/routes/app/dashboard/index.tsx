import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "~/features/app/layout";

export const Route = createFileRoute("/app/dashboard/")({
  component: DashboardPage,
});
