import { createFileRoute } from "@tanstack/react-router";
import { App } from "~/features";
// import { useAccount, useConnect, useDisconnect } from "wagmi";

export const Route = createFileRoute("/(landing)/")({
  component: App,
});
