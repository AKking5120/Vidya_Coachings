import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Photo Gallery | Vidya Coachings',
  description: 'Photo gallery of Vidya Coachings — students, alumni, achievements and campus memories in Badarpur & Jaitpur, Delhi.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
