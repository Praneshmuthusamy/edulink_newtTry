import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Notifications</h2>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Send Notification</button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4" *ngFor="let n of notifications">
          <div class="card p-3">
            <div class="d-flex align-items-start gap-2">
              <span class="fs-5">{{ categoryIcon(n.category) }}</span>
              <div class="flex-grow-1">
                <div class="fw-semibold small" style="color:var(--text-primary)">{{ n.message }}</div>
                <div class="text-muted" style="font-size:0.75rem">{{ n.category }} • User {{ n.userId }}</div>
                <div class="text-muted" style="font-size:0.75rem">{{ n.createdDate | date:'short' }}</div>
              </div>
              <span class="badge" [ngClass]="n.status==='UNREAD'?'bg-primary':'bg-secondary'">{{ n.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">Send Notification</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>User ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.userId"></div>
              <div class="mb-3"><label>Entity ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.entityId"></div>
              <div class="mb-3"><label>Message</label><textarea class="form-control mt-1" [(ngModel)]="form.message" rows="3"></textarea></div>
              <div class="mb-3">
                <label>Category</label>
                <select class="form-select mt-1" [(ngModel)]="form.category">
                  <option value="ENROLLMENT">ENROLLMENT</option>
                  <option value="EXAM">EXAM</option>
                  <option value="COMPLIANCE">COMPLIANCE</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="send()">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminNotificationsComponent implements OnInit {
  notifications: any[] = [];
  showModal = false;
  form: any = {};

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void { this.api.getNotifications().subscribe(n => this.notifications = n); }

  resetForm(): void { this.form = { userId: '', entityId: '', message: '', category: 'GENERAL', status: 'UNREAD' }; }

  send(): void {
    this.api.createNotification(this.form).subscribe({
      next: () => { this.toast.show('Notification sent', 'success'); this.showModal = false; this.api.getNotifications().subscribe(n => this.notifications = n); },
      error: () => this.toast.show('Failed to send', 'error')
    });
  }

  categoryIcon(cat: string): string {
    const map: any = { ENROLLMENT: '📋', EXAM: '📝', COMPLIANCE: '🛡️', GENERAL: '🔔' };
    return map[cat] || '🔔';
  }
}
