import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-teacher-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Learning Materials</h2>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add Material</button>
      </div>

      <div class="row g-3">
        <div class="col-md-4" *ngFor="let m of materials">
          <div class="card p-3">
            <div class="d-flex align-items-start gap-2">
              <span class="fs-3">{{ m.fileUri?.endsWith('.pdf') ? '📄' : '🎬' }}</span>
              <div class="flex-grow-1">
                <div class="fw-semibold" style="color:var(--text-primary)">{{ m.title }}</div>
                <div class="text-muted small">Course ID: {{ m.courseId }}</div>
                <div class="text-muted small">{{ m.uploadedDate }}</div>
                <a *ngIf="m.fileUri" [href]="m.fileUri" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Open</a>
              </div>
              <span class="badge" [ngClass]="m.status==='ACTIVE'?'bg-success':'bg-secondary'">{{ m.status }}</span>
            </div>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary" (click)="edit(m)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" (click)="delete(m.materialId)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit Material' : 'Add Material' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Course ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.courseId"></div>
              <div class="mb-3"><label>Title</label><input class="form-control mt-1" [(ngModel)]="form.title"></div>
              <div class="mb-3"><label>File URI (PDF/Video URL)</label><input class="form-control mt-1" [(ngModel)]="form.fileUri" placeholder="https://..."></div>
              <div class="mb-3"><label>Upload Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.uploadedDate"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">{{ editId ? 'Update' : 'Add' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeacherMaterialsComponent implements OnInit {
  materials: any[] = [];
  showModal = false;
  editId: number | null = null;
  form: any = {};

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void { this.api.getMaterials().subscribe(m => this.materials = m); }

  resetForm(): void { this.editId = null; this.form = { courseId: '', title: '', fileUri: '', uploadedDate: '', status: 'ACTIVE' }; }

  edit(m: any): void {
    this.editId = m.materialId;
    this.form = { courseId: m.courseId, title: m.title, fileUri: m.fileUri, uploadedDate: m.uploadedDate, status: m.status };
    this.showModal = true;
  }

  save(): void {
    const obs = this.editId ? this.api.updateMaterial(this.editId, this.form) : this.api.createMaterial(this.form);
    obs.subscribe({
      next: () => { this.toast.show('Material saved', 'success'); this.showModal = false; this.api.getMaterials().subscribe(m => this.materials = m); },
      error: () => this.toast.show('Failed', 'error')
    });
  }

  delete(id: number): void {
    this.api.deleteMaterial(id).subscribe({
      next: () => { this.toast.show('Material deleted', 'success'); this.api.getMaterials().subscribe(m => this.materials = m); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
