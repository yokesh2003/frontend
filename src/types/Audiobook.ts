
export interface Audiobook {
  audioId: number;
  title: string;
  narrator: string;
  duration: number | null;
  description: string;
  price: number;
  coverImage: string | null;
  audioFile: string | null;
  shortClip: string | null;
  totalStar: number;
  authorId: number | null;
  authorName: string | null;
}

