import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ToastComponent } from '../shared/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ToastComponent],
  template: `
    <div class="d-flex">
      <nav class="sidebar d-flex flex-column" [class.open]="sidebarOpen">
        <div class="brand">
          <span>🎓 EduLink</span>
        </div>
        <div class="p-3 text-center">
          <div class="rounded-circle bg-accent d-inline-flex align-items-center justify-content-center mb-2"
            style="width:48px;height:48px;background:var(--accent)">
            <span class="text-white fw-bold">{{ initials }}</span>
          </div>
          <div class="text-white small fw-semibold">{{ email }}</div>
          <span class="badge mt-1" [ngClass]="roleBadge">{{ role }}</span>
        </div>
        <ul class="nav flex-column flex-grow-1 px-2">
          <li *ngFor="let item of navItems" class="nav-item">
            <a class="nav-link" [routerLink]="item.path" routerLinkActive="active">
              <span>{{ item.icon }}</span> {{ item.label }}
            </a>
          </li>
        </ul>
        <div class="p-3">
          <button class="btn btn-sm w-100" style="background:rgba(255,255,255,0.1);color:#fff" (click)="logout()">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div class="main-content flex-grow-1">
        <div class="topbar">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-sm d-md-none" style="background:var(--bg-secondary);color:var(--text-primary)" (click)="sidebarOpen=!sidebarOpen">☰</button>
            <span class="fw-semibold" style="color:var(--text-primary)">{{ pageTitle }}</span>
          </div>
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-sm" style="background:var(--bg-secondary);color:var(--text-primary)" (click)="toggleTheme()">
              {{ isDark ? '☀️' : '🌙' }}
            </button>
            <span class="small text-muted">{{ email }}</span>
          </div>
        </div>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
    <app-toast></app-toast>
  `
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  email = '';
  role = '';
  initials = '';
  isDark = false;
  pageTitle = 'Dashboard';

  navItems: { path: string; label: string; icon: string }[] = [];

  private navMap: Record<string, { path: string; label: string; icon: string }[]> = {
    ADMIN: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/admin/users', label: 'Users', icon: '👥' },
      { path: '/admin/students', label: 'Students', icon: '🎒' },
      { path: '/admin/courses', label: 'Courses', icon: '📚' },
      { path: '/admin/attendance', label: 'Attendance', icon: '📋' },
      { path: '/admin/exams', label: 'Exams & Grades', icon: '📝' },
      { path: '/admin/compliance', label: 'Compliance', icon: '🛡️' },
      { path: '/admin/reports', label: 'Reports', icon: '📊' },
      { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    ],
    STUDENT: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/student/courses', label: 'My Courses', icon: '📚' },
      { path: '/student/exams', label: 'Exams', icon: '📝' },
      { path: '/student/grades', label: 'Grades', icon: '🏆' },
      { path: '/student/attendance', label: 'Attendance', icon: '📋' },
      { path: '/student/performance', label: 'Performance', icon: '📈' },
    ],
    TEACHER: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/teacher/courses', label: 'Courses', icon: '📚' },
      { path: '/teacher/materials', label: 'Materials', icon: '📄' },
      { path: '/teacher/exams', label: 'Exams', icon: '📝' },
      { path: '/teacher/attendance', label: 'Attendance', icon: '📋' },
      { path: '/teacher/students', label: 'Students', icon: '🎒' },
      { path: '/teacher/performance', label: 'Performance', icon: '📈' },
    ],
    COMPLIANCE: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/compliance/courses', label: 'Courses', icon: '📚' },
      { path: '/compliance/students', label: 'Students', icon: '🎒' },
      { path: '/compliance/records', label: 'Compliance Records', icon: '🛡️' },
      { path: '/compliance/audits', label: 'Audit Records', icon: '🔍' },
    ],
    BOARD: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/admin/courses', label: 'Courses', icon: '📚' },
      { path: '/admin/reports', label: 'Reports', icon: '📊' },
      { path: '/admin/compliance', label: 'Compliance', icon: '🛡️' },
    ],
    REGULATOR: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/regulator/compliance', label: 'Compliance Reports', icon: '🛡️' },
      { path: '/regulator/audits', label: 'Audit Logs', icon: '🔍' },
      { path: '/admin/reports', label: 'Reports', icon: '📊' },
    ],
  };

  constructor(private auth: AuthService, private theme: ThemeService) {}

  ngOnInit(): void {
    this.email = this.auth.getEmail() || '';
    this.role = this.auth.getRole() || '';
    this.initials = this.email.substring(0, 2).toUpperCase();
    this.isDark = this.theme.isDark();
    this.navItems = this.navMap[this.role] || [];
  }

  toggleTheme(): void {
    this.theme.toggle();
    this.isDark = this.theme.isDark();
  }

  logout(): void { this.auth.logout(); }

  get roleBadge(): string {
    const map: any = { ADMIN: 'bg-danger', STUDENT: 'bg-success', TEACHER: 'bg-primary', COMPLIANCE: 'bg-warning text-dark', BOARD: 'bg-info text-dark', REGULATOR: 'bg-secondary' };
    return map[this.role] || 'bg-secondary';
  }
}
