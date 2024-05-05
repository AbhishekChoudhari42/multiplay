import Image from "next/image";
import Multiplay from '@/components/multiplay'
import Joinroom from "@/components/joinroom";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-banner">
        <Joinroom/>
    </main>
  );
}
