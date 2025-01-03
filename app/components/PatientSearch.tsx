"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PatientSearchProps {
  onSearch: (query: string) => void;
}

export function PatientSearch({ onSearch }: PatientSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar pacientes..."
        className="pl-8 italic capitalize"
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}
