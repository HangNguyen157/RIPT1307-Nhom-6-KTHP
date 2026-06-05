export interface CommentReply {
  id: string;
  author: string;
  authorId?: string;
  timestamp: string;
  content: string;
  votes: number;
}

export interface Comment {
  id: string;
  questionId: string;
  parentId?: string | null;
  author: string;
  authorId?: string;
  authorRole?: 'student' | 'teacher' | 'admin';
  authorRep?: number;
  avatar?: string;
  timestamp: string;
  votes: number;
  isBest?: boolean;
  content: string;
  replies: CommentReply[];
}
