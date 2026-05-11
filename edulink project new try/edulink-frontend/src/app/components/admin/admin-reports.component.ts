import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Reports</h2>
        <button class="btn-accent" *ngIf="canCreate" (click)="showModal=true;resetForm()">+ Generate Report</button>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>Report ID</th><th>Scope</th><th>Metrics</th><th>Generated Date</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of reports">
              <td>{{ r.reportId }}</td>
              <td><span class="badge bg-primary">{{ r.scope }}</span></td>
              <td>{{ r.metrics }}</td>
              <td>{{ r.generatedDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">Generate Report</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label>Scope</label>
                <select class="form-select mt-1" [(ngModel)]="form.scope">
                  <option value="STUDENT">STUDENT</option>
                  <option value="COURSE">COURSE</option>
                  <option value="COMPLIANCE">COMPLIANCE</option>
                  <option value="PERFORMANCE">PERFORMANCE</option>
                </select>
              </div>
              <div class="mb-3"><label>Metrics</label><textarea class="form-control mt-1" [(ngModel)]="form.metrics" rows="3" placeholder="Describe metrics..."></textarea></div>
              <div class="mb-3"><label>Generated Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.generatedDate"></div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">Generate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminReportsComponent implements OnInit {
  reports: any[] = [];
  showModal = false;
  form: any = {};
  canCreate = false;

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.canCreate = ['ADMIN', 'BOARD'].includes(this.auth.getRole() || '');
    this.api.getReports().subscribe(r => this.reports = r);
  }

  resetForm(): void { this.form = { scope: 'STUDENT', metrics: '', generatedDate: '' }; }

  save(): void {
    this.api.createReport(this.form).subscribe({
      next: () => { this.toast.show('Report generated', 'success'); this.showModal = false; this.api.getReports().subscribe(r => this.reports = r); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
