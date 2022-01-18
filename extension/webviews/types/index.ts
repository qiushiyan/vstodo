export interface User {
  id: number;
  name: string;
  githubId: string;
}

export interface Todo {
  id: number;
  title: string;
  creatorId: number;
  completed: boolean;
}

export interface PostMessage {
  type: string;
  value: string;
}
