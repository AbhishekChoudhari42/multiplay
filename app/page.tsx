import Image from "next/image";
import Multiplay from '@/app/multiplay'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Multiplay/>
    </main>
  );
}
