export function FlagIcon({ code }: { code: string }) {
  const src = `...`; // kode flag logic

  return (
    <div className="relative">
      <img
        data-testid="flag-icon"
        className="w-8 h-6 border-2 border-black shadow-sm sm:w-6 sm:h-4"
        src={src}
        alt={`Flag ${code}`}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
    </div>
  );
}
