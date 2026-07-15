// Shape returned by the Google Apps Script web app (ReviewsBackend.gs)
export interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;   // GAS uses "text", not "review_text"
  date: string;
}

// Shape sent when submitting a new review to GAS
export interface ReviewSubmission {
  name: string;
  role: string;
  rating: number;
  text: string;
}

export interface Download {
  id: number;
  title: string;
  category: 'notes' | 'circulars';
  class_label: string;
  file_url: string;
  file_type: string;
  published: boolean;
  created_at: string;
}

export interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  category: 'general' | 'students' | 'alumni' | 'achievements';
  published: boolean;
  created_at: string;
}

export interface AdmissionFormData {
  student_name: string;
  class: string;
  parent_name: string;
  phone: string;
  email?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message: string;
}
