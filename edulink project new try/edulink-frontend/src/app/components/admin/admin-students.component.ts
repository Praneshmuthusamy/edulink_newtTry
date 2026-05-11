import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Students</h2>
        <button class="btn-accent" *ngIf="role==='ADMIN'" (click)="showModal=true;resetForm()">+ Add Student</button>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>Name</th><th>DOB</th><th>Gender</th><th>Contact</th><th>Enrolled</th><th>Status</th><th *ngIf="role==='ADMIN'">Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of students">
              <td class="fw-semibold">{{ s.name }}</td>
              <td>{{ s.dob }}</td>
              <td>{{ s.gender }}</td>
              <td>{{ s.contactInfo }}</td>
              <td>{{ s.enrollmentDate }}</td>
              <td><span class="badge" [ngClass]="s.status==='ACTIVE'?'bg-success':'bg-secondary'">{{ s.status }}</span></td>
              <td *ngIf="role==='ADMIN'">
                <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(s)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" (click)="delete(s.studentId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit Student' : 'Add Student' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12"><label>Name</label><input class="form-control mt-1" [(ngModel)]="form.name"></div>
                <div class="col-6"><label>Date of Birth</label><input type="date" class="form-control mt-1" [(ngModel)]="form.dob"></div>
                <div class="col-6">
                  <label>Gender</label>
                  <select class="form-select mt-1" [(ngModel)]="form.gender">
                    <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
                  </select>
                </div>
                <div class="col-12"><label>Address</label><input class="form-control mt-1" [(ngModel)]="form.address"></div>
                <div class="col-6"><label>Contact Info</label><input class="form-control mt-1" [(ngModel)]="form.contactInfo"></div>
                <div class="col-6"><label>Enrollment Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.enrollmentDate"></div>
                <div class="col-12">
                  <label>Status</label>
                  <select class="form-select mt-1" [(ngModel)]="form.status">
                    <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
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
export class AdminStudentsComponent implements OnInit {
  students: any[] = [];
  showModal = false;
  editId: number | null = null;
  form: any = {};
  role = '';

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() || '';
    this.load();
  }

  load(): void { this.api.getStudents().subscribe(s => this.students = s); }

  resetForm(): void {
    this.editId = null;
    this.form = { name: '', dob: '', gender: 'MALE', address: '', contactInfo: '', enrollmentDate: '', status: 'ACTIVE' };
  }

  edit(s: any): void {
    this.editId = s.studentId;
    this.form = { name: s.name, dob: s.dob, gender: s.gender, address: s.address, contactInfo: s.contactInfo, enrollmentDate: s.enrollmentDate, status: s.status };
    this.showModal = true;
  }

  save(): void {
    const obs = this.editId ? this.api.updateStudent(this.editId, this.form) : this.api.createStudent(this.form);
    obs.subscribe({
      next: () => { this.toast.show(this.editId ? 'Student updated' : 'Student enrolled', 'success'); this.showModal = false; this.load(); },
      error: () => this.toast.show('Operation failed', 'error')
    });
  }

  delete(id: number): void {
    this.api.deleteStudent(id).subscribe({
      next: () => { this.toast.show('Student removed', 'success'); this.load(); },
      error: () => this.toast.show('Delete failed', 'error')
    });
  }
}
