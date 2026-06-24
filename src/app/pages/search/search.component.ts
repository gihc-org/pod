import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { PodcastService } from '../../services/podcast.service';
import { SearchResult } from '../../models/podcast.model';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private searchService = inject(SearchService);
  private podcastService = inject(PodcastService);

  query = '';
  results = signal<SearchResult[]>([]);
  loading = signal(false);
  error = signal('');
  subscribedIds = signal<Set<string>>(new Set());
  subscribingId = signal('');

  search() {
    const q = this.query.trim();
    if (!q) return;
    this.loading.set(true);
    this.error.set('');
    this.results.set([]);
    this.searchService.search(q).subscribe({
      next: (res) => {
        this.results.set(res.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Søgning fejlede. Er backend kørende på port 3000?');
        this.loading.set(false);
      }
    });
  }

  subscribe(result: SearchResult) {
    this.subscribingId.set(result.id.toString());
    this.podcastService.addSubscription({
      feedUrl: result.feedUrl,
      title: result.title,
      author: result.author,
      image: result.artwork
    }).subscribe({
      next: () => {
        this.subscribedIds.update(ids => new Set([...ids, result.id.toString()]));
        this.subscribingId.set('');
      },
      error: () => {
        this.subscribedIds.update(ids => new Set([...ids, result.id.toString()]));
        this.subscribingId.set('');
      }
    });
  }

  isSubscribed(id: string | number) {
    return this.subscribedIds().has(id.toString());
  }

  isSubscribing(id: string | number) {
    return this.subscribingId() === id.toString();
  }
}
