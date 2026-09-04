// A small colored "file type" badge — the classic folded-corner page shape
// with a colored label band (PDF/DOC/IMG), the same visual language as the
// file icons in Windows Explorer, Google Drive, etc. Deliberately not a
// generic action icon (rotate, crop, ...) — the point is you recognize the
// file type at a glance, the same way every other tool site does it.

interface FileTypeIconProps {
  label: string;
  color: string;
  className?: string;
}

export function FileTypeIcon({ label, color, className = "h-12 w-11" }: FileTypeIconProps) {
  return (
    <svg viewBox="0 0 40 48" className={className} aria-hidden="true">
      <path
        d="M6,3 L23,3 L33,13 L33,45 L6,45 Z"
        fill="#FFFFFF"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M23,3 L33,13 L23,13 Z"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="11" y1="19" x2="21" y2="19" stroke={color} strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="25" x2="25" y2="25" stroke={color} strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="6" y="31" width="27" height="11" rx="1.5" fill={color} />
      <text
        x="19.5"
        y="39.3"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#FFFFFF"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.3"
      >
        {label}
      </text>
    </svg>
  );
}
