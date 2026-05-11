import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-teacher-performance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Student Performance & Competency</h2>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add Metric</button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4" *ngFor="let m of metrics">
          <div class="card p-3">
            <div class="d-flex justify-content-between mb-2">
              <span class="fw-semibold" style="color:var(--text-primary)">Student {{ m.studentId }}</span>
              <span class="badge" [ngClass]="competencyBadge(m.score)">{{ competencyLabel(m.score) }}</span>
            </div>
            <div class="text-muted small mb-2">Course {{ m.courseId }} • {{ m.date }}</div>
            <div class="d-flex align-items-center gap-2">
              <div class="progress flex-grow-1" style="height:8px">
                <div class="progress-bar" [style.width]="m.score + '%'" [ngClass]="progressColor(m.score)"></div>
              </div>
              <span class="fw-bold small" style="color:var(--text-primary)">{{ m.score }}%</span>
            </div>
            <div class="mt-2 small text-muted" *ngIf="m.score < 60">⚠️ Skill gap identified</div>
          </div>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">Add Performance Metric</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Student ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.studentId"></div>
              <div class="mb-3"><label>Course ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.courseId"></div>
              <div class="mb-3"><label>Score (%)</label><input type="number" class="form-control mt-1" [(ngModel)]="form.score" min="0" max="100"></div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.date"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeacherPerformanceComponent implements OnInit {
  metrics: any[] = [];
  showModal = false;
  form: any = {};

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void { this.api.getPerformance().subscribe(m => this.metrics = m); }

  resetForm(): void { this.form = { studentId: '', courseId: '', score: 0, date: '', status: 'ACTIVE' }; }

  save(): void {
    this.api.createPerformance(this.form).subscribe({
      next: () => { this.toast.show('Metric added', 'success'); this.showModal = false; this.api.getPerformance().subscribe(m => this.metrics = m); },
      error: () => this.toast.show('Failed', 'error')
    });
  }

  competencyLabel(score: number): string {
    if (score >= 85) return 'Expert';
    if (score >= 70) return 'Proficient';
    if (score >= 50) return 'Developing';
    return 'Beginner';
  }

  competencyBadge(score: number): string {
    if (score >= 85) return 'bg-success';
    if (score >= 70) return 'bg-primary';
    if (score >= 50) return 'bg-warning text-dark';
    return 'bg-danger';
  }

  progressColor(score: number): string {
    if (score >= 70) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-danger';
  }
}
