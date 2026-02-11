function Button({
  children,
  onClick,
  className,
}: {
  children: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
        onClick={onClick}
      className={`bg-emerald-600 py-2 px-4 rounded-md text-black font-bold hover:bg-emerald-700 cursor-pointer focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
