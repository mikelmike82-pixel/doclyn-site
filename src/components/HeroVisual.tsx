// Decorative device-mockup graphic for the hero section. Purely visual —
// a stylized browser window running Doclyn plus two floating benefit
// badges (compression, privacy), built from the site's own design tokens
// so it always stays on-brand instead of relying on an external image.
export function HeroVisual() {
  return (
    <svg
      viewBox="0 0 560 440"
      className="w-full max-w-[560px]"
      role="img"
      aria-label="Preview of the Doclyn tool interface, showing a file being compressed privately on-device"
    >
      {/* backdrop panel */}
      <rect x="40" y="20" width="520" height="380" rx="48" fill="#EEF0FE" />
      <circle cx="90" cy="70" r="50" fill="#3B4CF0" opacity="0.08" />
      <circle cx="500" cy="380" r="70" fill="#B8790A" opacity="0.06" />

      {/* floating file chip, top-left, rotated */}
      <g transform="rotate(-10 90 69)">
        <rect x="70" y="44" width="40" height="50" rx="6" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
        <path d="M100 44 L110 54 L100 54 Z" fill="#F7F8FA" stroke="#E4E7EC" strokeWidth="1" />
        <rect x="76" y="80" width="18" height="7" rx="2" fill="#3B4CF0" />
        <rect x="76" y="60" width="26" height="4" rx="2" fill="#E4E7EC" />
        <rect x="76" y="68" width="20" height="4" rx="2" fill="#E4E7EC" />
      </g>

      {/* laptop */}
      <rect x="100" y="70" width="360" height="230" rx="14" fill="#14181F" />
      <rect x="112" y="82" width="336" height="196" rx="6" fill="#FFFFFF" />

      {/* browser chrome */}
      <rect x="112" y="82" width="336" height="26" rx="6" fill="#F7F8FA" />
      <circle cx="124" cy="95" r="3" fill="#E4E7EC" />
      <circle cx="134" cy="95" r="3" fill="#E4E7EC" />
      <circle cx="144" cy="95" r="3" fill="#E4E7EC" />
      <rect x="170" y="88" width="160" height="14" rx="7" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
      <text x="182" y="98" fontFamily="Arial, sans-serif" fontSize="8" fill="#6B7280">
        doclyn.me
      </text>

      {/* mini hero content */}
      <rect x="210" y="118" width="140" height="11" rx="5.5" fill="#14181F" opacity="0.9" />
      <rect x="185" y="134" width="190" height="7" rx="3.5" fill="#6B7280" opacity="0.55" />

      <rect x="205" y="150" width="150" height="18" rx="9" fill="#FFFFFF" stroke="#3B4CF0" strokeWidth="1.3" />
      <circle cx="219" cy="159" r="3" fill="#3B4CF0" />
      <rect x="300" y="150" width="45" height="18" rx="9" fill="#3B4CF0" />

      {/* mini tool cards */}
      <g>
        <rect x="126" y="180" width="96" height="56" rx="6" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
        <circle cx="144" cy="200" r="10" fill="#EEF0FE" />
        <rect x="139" y="195" width="10" height="10" rx="2" fill="#3B4CF0" />
        <rect x="160" y="194" width="48" height="5" rx="2.5" fill="#14181F" opacity="0.75" />
        <rect x="160" y="203" width="38" height="4" rx="2" fill="#6B7280" opacity="0.5" />
      </g>
      <g>
        <rect x="232" y="180" width="96" height="56" rx="6" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
        <circle cx="250" cy="200" r="10" fill="#EEF0FE" />
        <rect x="245" y="195" width="10" height="10" rx="2" fill="#3B4CF0" />
        <rect x="266" y="194" width="48" height="5" rx="2.5" fill="#14181F" opacity="0.75" />
        <rect x="266" y="203" width="38" height="4" rx="2" fill="#6B7280" opacity="0.5" />
      </g>
      <g>
        <rect x="338" y="180" width="96" height="56" rx="6" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
        <circle cx="356" cy="200" r="10" fill="#EEF0FE" />
        <rect x="351" y="195" width="10" height="10" rx="2" fill="#3B4CF0" />
        <rect x="372" y="194" width="48" height="5" rx="2.5" fill="#14181F" opacity="0.75" />
        <rect x="372" y="203" width="38" height="4" rx="2" fill="#6B7280" opacity="0.5" />
      </g>

      {/* laptop base */}
      <rect x="70" y="300" width="420" height="12" rx="5" fill="#14181F" />
      <rect x="250" y="302" width="60" height="3" rx="1.5" fill="#6B7280" />

      {/* floating badge: compression */}
      <rect x="418" y="44" width="124" height="54" rx="14" fill="#14181F" opacity="0.06" />
      <rect x="414" y="40" width="124" height="54" rx="14" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
      <circle cx="436" cy="67" r="14" fill="#FBF1DE" />
      <path
        d="M436 61 L436 73 M430 67 L436 73 L442 67"
        fill="none"
        stroke="#B8790A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="458" y="64" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#14181F">
        -68% size
      </text>
      <text x="458" y="77" fontFamily="Arial, sans-serif" fontSize="8" fill="#6B7280">
        Instant compress
      </text>

      {/* floating badge: privacy */}
      <rect x="24" y="286" width="132" height="54" rx="14" fill="#14181F" opacity="0.06" />
      <rect x="20" y="282" width="132" height="54" rx="14" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
      <circle cx="44" cy="309" r="14" fill="#EEF0FE" />
      <rect x="39" y="308" width="10" height="8" rx="1.5" fill="none" stroke="#3B4CF0" strokeWidth="1.6" />
      <path d="M40 308 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#3B4CF0" strokeWidth="1.6" />
      <text x="66" y="306" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#14181F">
        100% private
      </text>
      <text x="66" y="319" fontFamily="Arial, sans-serif" fontSize="8" fill="#6B7280">
        Runs on your device
      </text>
    </svg>
  );
}
