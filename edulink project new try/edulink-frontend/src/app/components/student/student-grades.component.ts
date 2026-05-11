import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">My Grades & Results</h2>

      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Total Exams</div>
            <div class="fw-bold" style="font-size:2rem;color:var(--text-primary)">{{ grades.length }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Passed</div>
            <div class="fw-bold" style="font-size:2rem;color:#10b981">{{ passed }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Average Score</div>
            <div class="fw-bold" style="font-size:2rem;color:var(--accent)">{{ avgScore }}%</div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>Exam ID</th><th>Score</th><th>Grade</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let g of grades">
              <td>{{ g.examId }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="progress flex-grow-1" style="height:6px;max-width:80px">
                    <div class="progress-bar" [style.width]="g.score+'%'" [ngClass]="g.score>=60?'bg-success':'bg-danger'"></div>
                  </div>
                  {{ g.score }}
                </div>
              </td>
              <td><span class="badge bg-primary">{{ g.grade }}</span></td>
              <td><span class="badge" [ngClass]="g.status==='PASS'?'bg-success':'bg-danger'">{{ g.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class StudentGradesComponent implements OnInit {
  grades: any[] = [];
  passed = 0;
  avgScore = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getGrades().subscribe(g => {
      this.grades = g;
      this.passed = g.filter((x: any) => x.status === 'PASS').length;
      this.avgScore = g.length ? Math.round(g.reduce((a: number, x: any) => a + x.score, 0) / g.length) : 0;
    });
  }
}
