export interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId?: string | null;
  createdAt: string;
  children?: Folder[];
  notes?: Note[];
}

export interface Note {
  id: string;
  folderId: string;
  title?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  id: string;
  noteId: string;
  gptResponse: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  noteId: string;
  gptResponse: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  createdAt: string;
}

export interface FileInfo {
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
  uploadDate: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupData {
  name?: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
