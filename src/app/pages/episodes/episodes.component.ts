import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PodcastService } from '../../services/podcast.service';
import { PlayerService } from '../../services/player.service';
import { Podcast, Episode } from '../../models/podcast.model';

@Component({
  selector: 'app-episodes',
  imports: [CommonModule, RouterLink],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.scss'
})
export class EpisodesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private podcastService = inject(PodcastService);
  player = inject(PlayerService);

  podcast = signal<Podcast | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    const feedUrl = this.route.snapshot.queryParamMap.get('feed') ?? '';
    if (!feedUrl) {
      this.error.set('Ingen feed-URL angivet.');
      this.loading.set(false);
      return;
    }

    this.podcastService.getFeed(feedUrl).subscribe({
      next: (p) => {
        this.podcast.set({ ...p, feedUrl });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kunne ikke hente episoder. Prøv igen senere.');
        this.loading.set(false);
      }
    });
  }

  play(episode: Episode) {
    const pod = this.podcast();
    if (!pod) return;
    this.player.play(episode, pod);
  }

  isPlaying(episode: Episode): boolean {
    return this.player.isPlaying() && this.player.episode()?.guid === episode.guid;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
