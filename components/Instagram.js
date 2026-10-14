export default function Instagram({ url, label = '@np.construtora_', className = '' }) {
  return (
    <a className={`ig ${className}`} href={url} target="_blank" rel="noopener noreferrer" aria-label="Instagram da NP Construções">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
