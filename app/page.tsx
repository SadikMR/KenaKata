import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">Hello World</h1>
      </main>
      <Footer />
    </div>
  );
}
