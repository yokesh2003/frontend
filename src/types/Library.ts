import { Audiobook } from './Audiobook';

export interface Library {
  libraryId: number;
  customerId: number;
  audioId: number;
  audiobook: Audiobook;
  lastPosition: number;
  isCompleted: boolean;
}

