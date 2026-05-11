import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Courses</h2>
        <button class="btn-accent" *ngIf="canEdit" (click)="showModal=true;resetForm()">+ Add Course</button>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>Title</th><th>Subject</th><th>Grade Level</th><th>Credits</th><th>Status</th><th *ngIf="canEdit">Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of courses">
              <td class="fw-semibold">{{ c.title }}</td>
              <td>{{ c.subject }}</td>
              <td>{{ c.gradeLevel }}</td>
              <td>{{ c.credits }}</td>
              <td><span class="badge" [ngClass]="c.status==='ACTIVE'?'bg-success':'bg-secondary'">{{ c.status }}</span></td>
              <td *ngIf="canEdit">
                <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(c)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" *ngIf="role==='ADMIN'" (click)="delete(c.courseId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit Course' : 'Add Course' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Title</label><input class="form-control mt-1" [(ngModel)]="form.title"></div>
              <div class="mb-3"><label>Subject</label><input class="form-control mt-1" [(ngModel)]="form.subject"></div>
              <div class="mb-3"><label>Grade Level</label><input class="form-control mt-1" [(ngModel)]="form.gradeLevel"></div>
              <div class="mb-3"><label>Credits</label><input type="number" class="form-control mt-1" [(ngModel)]="form.credits"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">{{ editId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminCoursesComponent implements OnInit {
  courses: any[] = [];
  showModal = false;
  editId: number | null = null;
  form: any = {};
  role = '';
  canEdit = false;

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() || '';
    this.canEdit = ['ADMIN', 'TEACHER', 'BOARD'].includes(this.role);
    this.load();
  }

  load(): void { this.api.getCourses().subscribe(c => this.courses = c); }

  resetForm(): void {
    this.editId = null;
    this.form = { title: '', subject: '', gradeLevel: '', credits: 0, status: 'ACTIVE' };
  }

  edit(c: any): void {
    this.editId = c.courseId;
    this.form = { title: c.title, subject: c.subject, gradeLevel: c.gradeLevel, credits: c.credits, status: c.status };
    this.showModal = true;
  }

  save(): void {
    const obs = this.editId ? this.api.updateCourse(this.editId, this.form) : this.api.createCourse(this.form);
    obs.subscribe({
      next: () => { this.toast.show(this.editId ? 'Course updated' : 'Course created', 'success'); this.showModal = false; this.load(); },
      error: () => this.toast.show('Operation failed', 'error')
    });
  }

  delete(id: number): void {
    this.api.deleteCourse(id).subscribe({
      next: () => { this.toast.show('Course deleted', 'success'); this.load(); },
      error: () => this.toast.show('Delete failed', 'error')
    });
  }
}
