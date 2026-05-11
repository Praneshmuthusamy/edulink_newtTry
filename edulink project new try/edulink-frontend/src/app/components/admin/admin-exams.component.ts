import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item"><button class="nav-link" [class.active]="tab==='exams'" (click)="tab='exams'">Exams</button></li>
        <li class="nav-item"><button class="nav-link" [class.active]="tab==='grades'" (click)="tab='grades'">Grades</button></li>
      </ul>

      <div *ngIf="tab==='exams'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0">Exams</h2>
          <button class="btn-accent" *ngIf="canEdit" (click)="showExamModal=true;resetExam()">+ Add Exam</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead><tr><th>Exam ID</th><th>Course ID</th><th>Type</th><th>Date</th><th>Status</th><th *ngIf="canEdit">Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let e of exams">
                <td>{{ e.examId }}</td>
                <td>{{ e.courseId }}</td>
                <td><span class="badge bg-info text-dark">{{ e.type }}</span></td>
                <td>{{ e.date }}</td>
                <td><span class="badge" [ngClass]="e.status==='SCHEDULED'?'bg-primary':e.status==='COMPLETED'?'bg-success':'bg-secondary'">{{ e.status }}</span></td>
                <td *ngIf="canEdit">
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="editExam(e)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" *ngIf="role==='ADMIN'" (click)="deleteExam(e.examId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="tab==='grades'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0">Grades</h2>
          <button class="btn-accent" *ngIf="canEdit" (click)="showGradeModal=true;resetGrade()">+ Add Grade</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead><tr><th>Grade ID</th><th>Exam ID</th><th>Student ID</th><th>Score</th><th>Grade</th><th>Status</th><th *ngIf="canEdit">Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let g of grades">
                <td>{{ g.gradeId }}</td>
                <td>{{ g.examId }}</td>
                <td>{{ g.studentId }}</td>
                <td>{{ g.score }}</td>
                <td><span class="badge bg-success">{{ g.grade }}</span></td>
                <td>{{ g.status }}</td>
                <td *ngIf="canEdit">
                  <button class="btn btn-sm btn-outline-primary" (click)="editGrade(g)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showExamModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ examEditId ? 'Edit Exam' : 'Add Exam' }}</h5>
              <button class="btn-close" (click)="showExamModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Course ID</label><input type="number" class="form-control mt-1" [(ngModel)]="examForm.courseId"></div>
              <div class="mb-3">
                <label>Type</label>
                <select class="form-select mt-1" [(ngModel)]="examForm.type">
                  <option value="QUIZ">QUIZ</option><option value="PRACTICAL">PRACTICAL</option><option value="FINAL">FINAL</option>
                </select>
              </div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="examForm.date"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="examForm.status">
                  <option value="SCHEDULED">SCHEDULED</option><option value="COMPLETED">COMPLETED</option><option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showExamModal=false">Cancel</button>
              <button class="btn-accent" (click)="saveExam()">{{ examEditId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showGradeModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ gradeEditId ? 'Edit Grade' : 'Add Grade' }}</h5>
              <button class="btn-close" (click)="showGradeModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Exam ID</label><input type="number" class="form-control mt-1" [(ngModel)]="gradeForm.examId"></div>
              <div class="mb-3"><label>Student ID</label><input type="number" class="form-control mt-1" [(ngModel)]="gradeForm.studentId"></div>
              <div class="mb-3"><label>Score</label><input type="number" class="form-control mt-1" [(ngModel)]="gradeForm.score"></div>
              <div class="mb-3"><label>Grade</label><input class="form-control mt-1" [(ngModel)]="gradeForm.grade" placeholder="A, B, C..."></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="gradeForm.status">
                  <option value="PASS">PASS</option><option value="FAIL">FAIL</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showGradeModal=false">Cancel</button>
              <button class="btn-accent" (click)="saveGrade()">{{ gradeEditId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminExamsComponent implements OnInit {
  tab = 'exams';
  exams: any[] = [];
  grades: any[] = [];
  showExamModal = false;
  showGradeModal = false;
  examEditId: number | null = null;
  gradeEditId: number | null = null;
  examForm: any = {};
  gradeForm: any = {};
  canEdit = false;
  role = '';

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() || '';
    this.canEdit = ['ADMIN', 'TEACHER'].includes(this.role);
    this.api.getExams().subscribe(e => this.exams = e);
    this.api.getGrades().subscribe(g => this.grades = g);
  }

  resetExam(): void { this.examEditId = null; this.examForm = { courseId: '', type: 'QUIZ', date: '', status: 'SCHEDULED' }; }
  resetGrade(): void { this.gradeEditId = null; this.gradeForm = { examId: '', studentId: '', score: 0, grade: '', status: 'PASS' }; }

  editExam(e: any): void { this.examEditId = e.examId; this.examForm = { courseId: e.courseId, type: e.type, date: e.date, status: e.status }; this.showExamModal = true; }
  editGrade(g: any): void { this.gradeEditId = g.gradeId; this.gradeForm = { examId: g.examId, studentId: g.studentId, score: g.score, grade: g.grade, status: g.status }; this.showGradeModal = true; }

  saveExam(): void {
    const obs = this.examEditId ? this.api.updateExam(this.examEditId, this.examForm) : this.api.createExam(this.examForm);
    obs.subscribe({
      next: () => { this.toast.show('Exam saved', 'success'); this.showExamModal = false; this.api.getExams().subscribe(e => this.exams = e); },
      error: () => this.toast.show('Failed', 'error')
    });
  }

  saveGrade(): void {
    const obs = this.gradeEditId ? this.api.updateGrade(this.gradeEditId, this.gradeForm) : this.api.createGrade(this.gradeForm);
    obs.subscribe({
      next: () => { this.toast.show('Grade saved', 'success'); this.showGradeModal = false; this.api.getGrades().subscribe(g => this.grades = g); },
      error: () => this.toast.show('Failed', 'error')
    });
  }

  deleteExam(id: number): void {
    this.api.deleteExam(id).subscribe({
      next: () => { this.toast.show('Exam deleted', 'success'); this.api.getExams().subscribe(e => this.exams = e); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
