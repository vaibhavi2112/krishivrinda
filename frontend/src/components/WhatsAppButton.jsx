export default function WhatsAppButton({ mobile, message, label = '💬 व्हॉट्सॲप' }) {
  const openWhatsApp = () => {
    const clean = (mobile || '').replace(/\D/g, '');
    if (!clean) {
      alert('मोबाइल नंबर उपलब्ध नाही');
      return;
    }
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(message || 'नमस्कार')}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      style={{
        padding: '10px 16px',
        borderRadius: 10,
        border: 'none',
        background: '#25D366',
        color: '#fff',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
}