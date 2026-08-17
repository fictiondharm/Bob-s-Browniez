import { useState } from "react";

const FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="#f3ede4"/><circle cx="300" cy="210" r="110" fill="#e9bda7"/><rect x="210" y="280" width="180" height="22" rx="11" fill="#2a180d" opacity="0.7"/><text x="300" y="195" text-anchor="middle" font-family="Georgia,serif" font-size="60" font-weight="800" fill="#3d2314">Bob's</text></svg>`
)}`;

export default function SafeImg({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false);
  const [srcState, setSrcState] = useState(src);

  if (failed) {
    return <div className={className} style={style} role="img" aria-label={alt} />;
  }

  return (
    <img
      src={srcState}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => {
        if (!failed) {
          setFailed(true);
        } else {
          setSrcState(FALLBACK);
        }
      }}
    />
  );
}
