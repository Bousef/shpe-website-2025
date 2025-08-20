export default function Link({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className="text-blue-500 underline hover:text-blue-700">
      {children}
    </a>
  );
}
