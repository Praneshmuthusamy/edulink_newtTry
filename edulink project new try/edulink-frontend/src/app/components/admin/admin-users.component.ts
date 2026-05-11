import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">User Management</h2>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add User</button>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td class="fw-semibold">{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone }}</td>
              <td><span class="badge" [ngClass]="roleBadge(u.role)">{{ u.role }}</span></td>
              <td><span class="badge" [ngClass]="u.status==='ACTIVE'?'bg-success':'bg-secondary'">{{ u.status }}</span></td>
              <td><button class="btn btn-sm btn-outline-primary" (click)="edit(u)">Edit</button></td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="6" class="text-center text-muted py-4">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit User' : 'Register User' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" *ngIf="!editId"><label>Full Name</label><input class="form-control mt-1" [(ngModel)]="form.name" placeholder="Full name"></div>
              <div class="mb-3" *ngIf="!editId"><label>Email</label><input type="email" class="form-control mt-1" [(ngModel)]="form.email" placeholder="Email"></div>
              <div class="mb-3"><label>Phone</label><input class="form-control mt-1" [(ngModel)]="form.phone" placeholder="Phone"></div>
              <div class="mb-3" *ngIf="!editId"><label>Password</label><input type="password" class="form-control mt-1" [(ngModel)]="form.password" placeholder="Password"></div>
              <div class="mb-3" *ngIf="!editId">
                <label>Role</label>
                <select class="form-select mt-1" [(ngModel)]="form.role">
                  <option value="">Select role</option>
                  <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
                </select>
              </div>
              <div class="mb-3" *ngIf="editId">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">{{ editId ? 'Update' : 'Register' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  showModal = false;
  editId: number | null = null;
  roles = ['STUDENT', 'TEACHER', 'COMPLIANCE', 'BOARD', 'REGULATOR'];
  form: any = {};

  constructor(private auth: AuthService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.auth.getUsers().pipe(catchError(() => {
      this.toast.show('Failed to load users', 'error');
      return of([]);
    })).subscribe(u => this.users = u);
  }

  resetForm(): void {
    this.editId = null;
    this.form = { name: '', email: '', phone: '', password: '', role: '', status: 'ACTIVE' };
  }

  edit(u: any): void {
    this.editId = u.userId;
    this.form = { name: u.name, phone: u.phone, status: u.status };
    this.showModal = true;
  }

  save(): void {
    if (this.editId) {
      this.auth.updateUser(this.editId, this.form).subscribe({
        next: () => { this.toast.show('User updated successfully', 'success'); this.showModal = false; this.load(); },
        error: () => this.toast.show('Failed to update user', 'error')
      });
    } else {
      this.auth.register(this.form).subscribe({
        next: () => { this.toast.show('User registered successfully', 'success'); this.showModal = false; this.load(); },
        error: () => this.toast.show('Failed to register user', 'error')
      });
    }
  }

  roleBadge(role: string): string {
    const map: any = { ADMIN: 'bg-danger', STUDENT: 'bg-success', TEACHER: 'bg-primary', COMPLIANCE: 'bg-warning text-dark', BOARD: 'bg-info text-dark', REGULATOR: 'bg-secondary' };
    return map[role] || 'bg-secondary';
  }
}
