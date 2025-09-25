import { createFileRoute } from "@tanstack/react-router";
import { AppHomePage } from "~/features/app/home";

export const Route = createFileRoute("/app/home/")({
  component: AppHomePage,
});
