import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Attendance</h2>
        <button class="btn-accent" *ngIf="canEdit" (click)="showModal=true;resetForm()">+ Mark Attendance</button>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>Attendance ID</th><th>Student ID</th><th>Class ID</th><th>Date</th><th>Status</th><th *ngIf="canEdit">Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of attendance">
              <td>{{ a.attendanceId }}</td>
              <td>{{ a.studentId }}</td>
              <td>{{ a.classId }}</td>
              <td>{{ a.date }}</td>
              <td>
                <span class="badge" [ngClass]="a.status==='PRESENT'?'bg-success':a.status==='ABSENT'?'bg-danger':'bg-warning text-dark'">
                  {{ a.status }}
                </span>
              </td>
              <td *ngIf="canEdit">
                <button class="btn btn-sm btn-outline-primary" (click)="edit(a)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Update Attendance' : 'Mark Attendance' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Student ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.studentId"></div>
              <div class="mb-3"><label>Class ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.classId"></div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.date"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">{{ editId ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminAttendanceComponent implements OnInit {
  attendance: any[] = [];
  showModal = false;
  editId: number | null = null;
  form: any = {};
  canEdit = false;

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.canEdit = ['ADMIN', 'TEACHER'].includes(this.auth.getRole() || '');
    this.load();
  }

  load(): void { this.api.getAttendance().subscribe(a => this.attendance = a); }

  resetForm(): void {
    this.editId = null;
    this.form = { studentId: '', classId: '', date: '', status: 'PRESENT' };
  }

  edit(a: any): void {
    this.editId = a.attendanceId;
    this.form = { studentId: a.studentId, classId: a.classId, date: a.date, status: a.status };
    this.showModal = true;
  }

  save(): void {
    const obs = this.editId ? this.api.updateAttendance(this.editId, this.form) : this.api.createAttendance(this.form);
    obs.subscribe({
      next: () => { this.toast.show('Attendance saved', 'success'); this.showModal = false; this.load(); },
      error: () => this.toast.show('Operation failed', 'error')
    });
  }
}
