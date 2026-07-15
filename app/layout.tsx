import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import NoticeModal from '@/components/NoticeModal';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
};

export const metadata: Metadata = {
  title: 'Vidya Coachings | Best Tuition Centre in Badarpur & Jaitpur, Delhi',
  description:
    'Vidya Coachings — Premier tuition centre in Badarpur & Jaitpur, South Delhi. Expert coaching for Class 1–12, CUET, CTET, competitive exams. Founded by Amarpal Saini with 10+ years experience.',
  keywords: ['tuition', 'coaching', 'Badarpur', 'Jaitpur', 'Delhi', 'Class 1-12', 'CUET', 'CTET'],
  openGraph: {
    title: 'Vidya Coachings | Best Tuition Centre in Badarpur & Jaitpur, Delhi',
    description: 'Quality education for Class 1–12 and competitive exams. Established 2015.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-[var(--font-poppins)] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <NoticeModal />
      </body>
    </html>
  );
}
