import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {}

  login(user: string) {
    if (user) {
      this.loggedIn.next(true);
      this.router.navigate(['/dashboard']);
    }
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
