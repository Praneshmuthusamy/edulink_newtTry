import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">My Exams</h2>

      <div class="row g-3">
        <div class="col-md-4" *ngFor="let e of exams">
          <div class="card p-3">
            <div class="d-flex justify-content-between mb-2">
              <span class="badge bg-info text-dark">{{ e.type }}</span>
              <span class="badge" [ngClass]="e.status==='SCHEDULED'?'bg-primary':e.status==='COMPLETED'?'bg-success':'bg-secondary'">{{ e.status }}</span>
            </div>
            <div class="fw-semibold mb-1" style="color:var(--text-primary)">Course {{ e.courseId }}</div>
            <div class="text-muted small">📅 {{ e.date }}</div>
          </div>
        </div>
        <div *ngIf="exams.length===0" class="col-12 text-center text-muted py-5">No exams scheduled.</div>
      </div>
    </div>
  `
})
export class StudentExamsComponent implements OnInit {
  exams: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.api.getExams().subscribe(e => this.exams = e); }
}
