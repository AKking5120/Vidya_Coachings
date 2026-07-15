import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Vidya Coachings',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin panel has its own layout — no public Navbar/Footer
  return <>{children}</>;
}
