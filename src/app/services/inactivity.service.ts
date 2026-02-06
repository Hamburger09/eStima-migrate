// inactivity.service.ts
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private authService: AuthService;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private injector: Injector
  ) {
    this.authService = this.injector.get(AuthService)
    this.setupIdle();
  }
  // Setup the idle service
  // Set the idle time, timeout, and interrupts
  private setupIdle(): void {
    this.idle.setIdle(15 * 60); // seconds
    this.idle.setTimeout(15); // seconds
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.handleIdleEnd());
    this.idle.onTimeout.subscribe(() => this.handleTimeout());
    this.idle.onIdleStart.subscribe(() => this.handleIdleStart());
    this.idle.onTimeoutWarning.subscribe((countdown) =>
      this.handleTimeoutWarning(countdown)
    );

    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.startWatching();
  }

  // Start watching for user inactivity
  public startWatching(): void {
    this.idle.watch();
    this.timedOut = false;
  }
  // Stop watching for user inactivity
  private handleIdleEnd(): void {
    this.idleState = 'No longer idle.';
    this.startWatching();
  }
  // Handle timeout event
  private handleTimeout(): void {
    this.idleState = 'Timed out!';
    this.timedOut = true;
    console.warn('User session timed out due to inactivity.');
    this.authService.logout().subscribe();
  }
  // Handle idle start event
  private handleIdleStart(): void {
    this.idleState = 'You will be logged out soon!';
    console.log('Idle started. Show a warning if needed.');
  }
  // Handle timeout warning event
  // This is where you can show a warning to the user
  private handleTimeoutWarning(countdown: number): void {
    this.idleState = `You will time out in ${countdown} seconds!`;
    console.log(this.idleState);
  }

  // Reset the idle timer
  public resetIdleWatch(): void {
    this.idle.stop();
    this.startWatching();
  }

  // Stop the idle timer
  // This can be used when the user logs out or when you want to stop tracking
  public stopIdleWatch(): void {
    this.idle.stop();
    this.idleState = 'Idle watch stopped.';
  }
}
