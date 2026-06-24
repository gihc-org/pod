import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Podcast, Episode } from '../models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getFeed(feedUrl: string): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.apiUrl}/podcasts/feed`, {
      params: { url: feedUrl }
    });
  }

  getSubscriptions(): Observable<Podcast[]> {
    return this.http.get<Podcast[]>(`${this.apiUrl}/subscriptions`);
  }

  addSubscription(podcast: Partial<Podcast>): Observable<Podcast> {
    return this.http.post<Podcast>(`${this.apiUrl}/subscriptions`, podcast);
  }

  removeSubscription(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subscriptions/${id}`);
  }
}
