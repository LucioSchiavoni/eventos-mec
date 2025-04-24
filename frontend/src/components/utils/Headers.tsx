import { Search } from "lucide-react";

export default function Header({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (value: string) => void }) {
  return (
    <header className="absolute top-0 right-0 z-10 flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute z-10 left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            placeholder="Buscar por email, lugar, organizador o código"
            className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
       
      </div>
    </header>
  );
}