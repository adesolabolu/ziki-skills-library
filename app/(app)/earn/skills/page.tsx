import { requireUser } from "@/lib/auth-helpers";
import { EarnSkillsPortal } from "./earn-skills-portal";

export const metadata = {
  title: "Contribute Skills — Ziki",
  description:
    "Contribute verified AI agent skills, test harnesses, and security linters to Ziki. Submit skills for maintainer review and community adoption.",
};

export default async function EarnSkillsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-6xl py-4 space-y-8">
      <EarnSkillsPortal
        user={{
          id: user.id,
          name: user.name || "Contributor",
          email: user.email || "",
        }}
      />
    </div>
  );
}
