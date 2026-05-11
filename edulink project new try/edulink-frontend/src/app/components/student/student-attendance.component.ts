import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">My Attendance</h2>

      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Total</div>
            <div class="fw-bold" style="font-size:2rem;color:var(--text-primary)">{{ attendance.length }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Present</div>
            <div class="fw-bold" style="font-size:2rem;color:#10b981">{{ present }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Absent</div>
            <div class="fw-bold" style="font-size:2rem;color:#ef4444">{{ absent }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Attendance %</div>
            <div class="fw-bold" style="font-size:2rem;color:var(--accent)">{{ pct }}%</div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>Date</th><th>Class ID</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of attendance">
              <td>{{ a.date }}</td>
              <td>{{ a.classId }}</td>
              <td>
                <span class="badge" [ngClass]="a.status==='PRESENT'?'bg-success':a.status==='ABSENT'?'bg-danger':'bg-warning text-dark'">
                  {{ a.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class StudentAttendanceComponent implements OnInit {
  attendance: any[] = [];
  present = 0;
  absent = 0;
  pct = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAttendance().subscribe(a => {
      this.attendance = a;
      this.present = a.filter((x: any) => x.status === 'PRESENT').length;
      this.absent = a.filter((x: any) => x.status === 'ABSENT').length;
      this.pct = a.length ? Math.round((this.present / a.length) * 100) : 0;
    });
  }
}
