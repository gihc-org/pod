import { Injectable, signal } from '@angular/core';
import { Episode, Podcast } from '../models/podcast.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  episode = signal<Episode | null>(null);
  podcast = signal<Podcast | null>(null);
  isPlaying = signal(false);

  play(episode: Episode, podcast: Podcast) {
    this.episode.set(episode);
    this.podcast.set(podcast);
    this.isPlaying.set(true);
  }

  togglePlay() {
    this.isPlaying.update(p => !p);
  }
}
