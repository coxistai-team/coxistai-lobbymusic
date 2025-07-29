import ContactForm from "@/components/ContactForm";
import LaunchBanner from "@/components/LaunchBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LaunchBanner />
      <ContactForm />
    </main>
  );
}
