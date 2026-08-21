// The mark: a larger outlined square (the original file) with a smaller
// filled square (the result) overlapping it — the compress/transform
// motif that's the actual core of the product, not a generic abstract icon.
export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" opacity="0.32" />
      <rect x="12" y="12" width="17" height="17" rx="6" fill="#F7F8FA" />
      <rect x="13" y="13" width="15" height="15" rx="5" fill="#3B4CF0" />
    </svg>
  );
}
