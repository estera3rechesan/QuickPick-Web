import Image from 'next/image';
import SearchInput from '@/components/SearchInput';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FFECEC] p-4">
      {/* Logo și titlu */}
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/LogoQP_roz.png"
          alt="QuickPick Logo"
          width={100}
          height={100}
          className="rounded-full mb-2"
          priority
        />
        <h1 className="text-4xl font-bold text-[#353935] mb-1">QuickPick</h1>
        <p className="text-lg text-[#353935]">Descoperă și alege rapid ce te interesează!</p>
      </div>

      {/* Search Bar */}
      <SearchInput />

      {/* Eventual, un mic hint sau exemplu sub search */}
      <p className="mt-6 text-[#353935] text-base text-center">
        Exemplu: <span className="font-semibold">restaurant italian 100 lei Timisoara</span>
      </p>
    </main>
  );
}
