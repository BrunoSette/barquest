import { getUser } from "@/lib/db/queries";
import Header from "@/components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
