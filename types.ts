export enum Sender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export enum AppView {
  LANDING = 'landing',
  LOGIN = 'login',
  LOGOUT = 'logout',
  CHAT = 'chat',
  LOG_ANALYZER = 'log_analyzer',
  VULN_SCANNER = 'vuln_scanner',
  QUIZ = 'quiz',
  CHEAT_SHEET = 'cheat_sheet'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  isActive: boolean;
  isFinished: boolean;
  selectedAnswer: number | null;
}
