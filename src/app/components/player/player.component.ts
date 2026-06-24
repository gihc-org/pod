import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, Injector, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements AfterViewInit {
  player = inject(PlayerService);
  private injector = inject(Injector);

  @ViewChild('audioEl', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  currentTime = signal(0);
  duration = signal(0);
  isDragging = false;

  private get audio(): HTMLAudioElement {
    return this.audioRef.nativeElement;
  }

  ngAfterViewInit() {
    effect(() => {
      const ep = this.player.episode();
      if (!ep) return;
      this.audio.src = ep.audioUrl;
      this.currentTime.set(0);
      this.duration.set(0);
    }, { injector: this.injector });

    effect(() => {
      const playing = this.player.isPlaying();
      if (!this.audio.src) return;
      if (playing) {
        this.audio.play().catch(() => this.player.isPlaying.set(false));
      } else {
        this.audio.pause();
      }
    }, { injector: this.injector });
  }

  onTimeUpdate() {
    if (!this.isDragging) {
      this.currentTime.set(this.audio.currentTime);
    }
  }

  onLoadedMetadata() {
    this.duration.set(this.audio.duration);
    if (this.player.isPlaying()) {
      this.audio.play().catch(() => {});
    }
  }

  onEnded() {
    this.player.isPlaying.set(false);
    this.currentTime.set(0);
  }

  onDragStart() {
    this.isDragging = true;
  }

  onDragEnd(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.audio.currentTime = value;
    this.currentTime.set(value);
    this.isDragging = false;
  }

  onDragMove(event: Event) {
    if (this.isDragging) {
      this.currentTime.set(+(event.target as HTMLInputElement).value);
    }
  }

  formatTime(s: number): string {
    if (!s || isNaN(s)) return '0:00';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  get progress(): number {
    return this.duration() ? (this.currentTime() / this.duration()) * 100 : 0;
  }
}
