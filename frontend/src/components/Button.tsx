function Button({
  children,
  onClick,
  className,
  disabled,
}: {
  children: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-emerald-600 py-2 px-4 rounded-md text-black font-bold disabled:bg-stone-600 hover:bg-emerald-700 cursor-pointer focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
