import RoleGuard from "@/components/shared/RoleGuard";


export default function Home() {
  return (
       <RoleGuard allowedRoles={["hr"]}>
    <main className="min-h-screen ">

    </main>
      </RoleGuard>
  );
}