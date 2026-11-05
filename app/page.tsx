import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Skills Library — Ziki",
  description:
    "Equip verified test runners, linters, and security guardrails directly onto your AI agents.",
};

export default function Page() {
  redirect("/skills");
}
