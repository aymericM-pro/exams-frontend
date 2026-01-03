export interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

export interface Question {
  id: number;
  title: string;
  type: 'single' | 'multiple' | 'text';
  answers: Answer[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt?: Date;
  semester?: string;
}
