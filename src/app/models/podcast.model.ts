export interface Podcast {
  id?: string;
  title: string;
  author: string;
  feedUrl: string;
  image: string;
  description?: string;
  episodes?: Episode[];
}

export interface Episode {
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  audioUrl: string;
  audioType: string;
  guid: string;
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  feedUrl: string;
  artwork: string;
  source: string;
}
