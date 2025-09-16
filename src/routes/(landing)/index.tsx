import { createFileRoute } from "@tanstack/react-router";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
import { LandingPage } from "~/features/landing/landing";

export const Route = createFileRoute("/(landing)/")({
  component: LandingPage,
});
