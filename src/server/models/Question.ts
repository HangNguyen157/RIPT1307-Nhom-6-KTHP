export interface Question {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  authorId?: string;
  authorRole?: 'student' | 'teacher' | 'admin';
  authorRep?: number;
  tags: string[];
  votes: number;
  comments: number;
  views: number;
  timestamp: string;
  subject?: string;
  isSolved?: boolean;
  status?: 'active' | 'reported' | 'hidden';
  createdAt?: string;
}
