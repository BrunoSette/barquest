import Footer from "@/components/footer";
import Header from "@/components/header";
import CTA from "@/components/cta";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <CTA />
      <Footer />
    </>
  );
}
