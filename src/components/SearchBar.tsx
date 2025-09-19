interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const imgUnion = "/d18868fcb443c7b7858b2c9a024ec212742a1754.svg";

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-[#1c1c1c] box-border content-stretch flex items-center justify-between px-[30px] relative rounded-[120px] w-full">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="py-[17px] bg-transparent border-none outline-none flex-1 font-sans font-semibold leading-[0] text-white text-[14px] placeholder:text-gray-400"
        />
        <div className="h-[12.627px] relative shrink-0 w-[12.605px]">
          <img alt="" className="block max-w-none size-full" src={imgUnion} />
        </div>
      </div>
    </div>
  );
}
