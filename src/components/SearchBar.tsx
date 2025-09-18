interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const imgUnion = "/d18868fcb443c7b7858b2c9a024ec212742a1754.svg";

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-[#f1f1f1] box-border content-stretch flex items-center justify-between px-[30px] relative rounded-[120px] w-full">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="py-[25px] bg-transparent border-none outline-none flex-1 font-sans font-semibold leading-[0] text-[#7e7e7e] text-[14px] placeholder-[#7e7e7e]"
        />
        <div className="h-[12.627px] relative shrink-0 w-[12.605px]">
          <img alt="" className="block max-w-none size-full" src={imgUnion} />
        </div>
      </div>
    </div>
  );
}
