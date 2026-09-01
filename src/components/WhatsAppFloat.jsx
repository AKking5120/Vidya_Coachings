import { SITE } from '../data/constants';

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${SITE.phoneRaw}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp" />
    </a>
  );
}
