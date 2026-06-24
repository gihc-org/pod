import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PodcastService } from '../../services/podcast.service';
import { Podcast } from '../../models/podcast.model';

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule, RouterLink],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  private podcastService = inject(PodcastService);

  subscriptions = signal<Podcast[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.podcastService.getSubscriptions().subscribe({
      next: (subs) => {
        this.subscriptions.set(subs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kunne ikke hente abonnementer. Er backend kørende?');
        this.loading.set(false);
      }
    });
  }

  unsubscribe(podcast: Podcast) {
    if (!podcast.id) return;
    this.podcastService.removeSubscription(podcast.id).subscribe({
      next: () => {
        this.subscriptions.update(subs => subs.filter(s => s.id !== podcast.id));
      }
    });
  }
}
