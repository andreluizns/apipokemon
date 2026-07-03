import searchIcon from '../../assets/icons/search.png';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border-[1.5px] border-[#CCCCCC] bg-[#FFFFFF] px-4 py-3">
      <img src={searchIcon} alt="" aria-hidden className="h-4 w-4" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Procurar Pokémon..."
        aria-label="Procurar Pokémon"
        className="w-full bg-transparent text-[14px] font-normal text-[#999999] outline-none placeholder:text-[#999999]"
      />
    </div>
  );
}
