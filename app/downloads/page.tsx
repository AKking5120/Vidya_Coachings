import type { Metadata } from 'next';
import DownloadsClient from './DownloadsClient';

export const metadata: Metadata = {
  title: 'Downloads | Notes & Circulars | Vidya Coachings',
  description: 'Download study notes and school circulars from Vidya Coachings, Badarpur & Jaitpur, Delhi.',
};

export default function DownloadsPage() {
  return <DownloadsClient />;
}
