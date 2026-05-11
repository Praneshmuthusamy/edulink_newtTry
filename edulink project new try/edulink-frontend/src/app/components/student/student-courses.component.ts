import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">My Enrolled Courses</h2>

      <div class="row g-3">
        <div class="col-md-6 col-lg-4" *ngFor="let c of courses">
          <div class="card p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div class="fw-bold" style="color:var(--text-primary)">{{ c.title }}</div>
                <div class="text-muted small">{{ c.subject }} • {{ c.gradeLevel }}</div>
              </div>
              <span class="badge" [ngClass]="c.status==='ACTIVE'?'bg-success':'bg-secondary'">{{ c.status }}</span>
            </div>
            <div class="text-muted small mb-3">Credits: {{ c.credits }}</div>

            <button class="btn btn-sm w-100 mb-2" style="background:var(--bg-secondary);color:var(--text-primary)"
              (click)="toggleMaterials(c.courseId)">
              {{ expanded[c.courseId] ? '▲ Hide' : '▼ View' }} Learning Materials
            </button>

            <div *ngIf="expanded[c.courseId]">
              <div *ngFor="let m of getMaterials(c.courseId)" class="d-flex align-items-center justify-content-between p-2 mb-1 rounded"
                style="background:var(--bg-secondary)">
                <div class="d-flex align-items-center gap-2">
                  <span>{{ m.fileUri?.endsWith('.pdf') ? '📄' : '🎬' }}</span>
                  <div>
                    <div class="small fw-semibold" style="color:var(--text-primary)">{{ m.title }}</div>
                    <a *ngIf="m.fileUri" [href]="m.fileUri" target="_blank" class="text-muted" style="font-size:0.75rem">Open file</a>
                  </div>
                </div>
                <button class="btn btn-sm" [ngClass]="completed[m.materialId]?'btn-success':'btn-outline-success'"
                  (click)="markComplete(m.materialId)">
                  {{ completed[m.materialId] ? '✓ Done' : 'Mark Complete' }}
                </button>
              </div>
              <div *ngIf="getMaterials(c.courseId).length===0" class="text-muted small text-center py-2">No materials yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentCoursesComponent implements OnInit {
  courses: any[] = [];
  materials: any[] = [];
  expanded: Record<number, boolean> = {};
  completed: Record<number, boolean> = {};

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void {
    this.api.getCourses().subscribe(c => this.courses = c);
    this.api.getMaterials().subscribe(m => this.materials = m);
    const saved = localStorage.getItem('completed_materials');
    if (saved) this.completed = JSON.parse(saved);
  }

  toggleMaterials(courseId: number): void {
    this.expanded[courseId] = !this.expanded[courseId];
  }

  getMaterials(courseId: number): any[] {
    return this.materials.filter(m => m.courseId === courseId);
  }

  markComplete(materialId: number): void {
    this.completed[materialId] = true;
    localStorage.setItem('completed_materials', JSON.stringify(this.completed));
    this.toast.show('Module marked as completed!', 'success');
  }
}
