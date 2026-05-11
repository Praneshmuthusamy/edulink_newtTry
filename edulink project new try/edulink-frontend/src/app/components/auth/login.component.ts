import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { ToastComponent } from '../shared/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background:var(--bg-primary)">
      <div class="card p-4 p-md-5" style="width:100%;max-width:420px">
        <div class="text-center mb-4">
          <div class="mb-3" style="font-size:3rem">🎓</div>
          <h2 class="fw-bold" style="color:var(--text-primary)">EduLink</h2>
          <p class="text-muted small">Sign in to your account</p>
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label>Email Address</label>
            <input type="email" class="form-control mt-1" [(ngModel)]="email" name="email" placeholder="you@example.com" required>
          </div>
          <div class="mb-4">
            <label>Password</label>
            <input type="password" class="form-control mt-1" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-accent w-100 py-2" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="text-center mt-3">
          <button class="btn btn-sm" style="background:var(--bg-secondary);color:var(--text-secondary)" (click)="toggleTheme()">
            {{ isDark ? '☀️ Light Mode' : '🌙 Dark Mode' }}
          </button>
        </div>
      </div>
    </div>
    <app-toast></app-toast>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  isDark = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private theme: ThemeService
  ) {
    this.isDark = this.theme.isDark();
  }

  onLogin(): void {
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.toast.show(`Welcome back! Logged in as ${res.role}`, 'success');
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      },
      error: () => {
        this.toast.show('Invalid credentials. Please try again.', 'error');
        this.loading = false;
      }
    });
  }

  toggleTheme(): void {
    this.theme.toggle();
    this.isDark = this.theme.isDark();
  }
}
