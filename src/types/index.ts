export interface BlogPostMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  readingTime: string;
  published: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  details: string[];
}
