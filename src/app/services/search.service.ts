import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResult } from '../models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  search(query: string): Observable<{ results: SearchResult[] }> {
    return this.http.get<{ results: SearchResult[] }>(`${this.apiUrl}/podcasts/search`, {
      params: { q: query }
    });
  }
}
