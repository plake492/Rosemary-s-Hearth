export default function IconButton({
  children,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1 ${className}`}
      type="button"
      style={style}
    >
      {children}
    </button>
  );
}
