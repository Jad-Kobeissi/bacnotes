export function Error({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  return <p className={`text-red-500 text-[1.3rem] ${className}`}>{error}</p>;
}
