import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/shared/dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users.component';
import { AdminCoursesComponent } from './components/admin/admin-courses.component';
import { AdminStudentsComponent } from './components/admin/admin-students.component';
import { AdminAttendanceComponent } from './components/admin/admin-attendance.component';
import { AdminExamsComponent } from './components/admin/admin-exams.component';
import { AdminComplianceComponent } from './components/admin/admin-compliance.component';
import { AdminReportsComponent } from './components/admin/admin-reports.component';
import { AdminNotificationsComponent } from './components/admin/admin-notifications.component';
import { TeacherMaterialsComponent } from './components/teacher/teacher-materials.component';
import { TeacherPerformanceComponent } from './components/teacher/teacher-performance.component';
import { StudentCoursesComponent } from './components/student/student-courses.component';
import { StudentGradesComponent } from './components/student/student-grades.component';
import { StudentPerformanceComponent } from './components/student/student-performance.component';
import { StudentAttendanceComponent } from './components/student/student-attendance.component';
import { StudentExamsComponent } from './components/student/student-exams.component';
import { ComplianceRecordsComponent } from './components/compliance/compliance-records.component';
import { ComplianceAuditsComponent } from './components/compliance/compliance-audits.component';
import { RegulatorComplianceComponent } from './components/regulator/regulator-compliance.component';
import { RegulatorAuditsComponent } from './components/regulator/regulator-audits.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin/users', component: AdminUsersComponent },
      { path: 'admin/courses', component: AdminCoursesComponent },
      { path: 'admin/students', component: AdminStudentsComponent },
      { path: 'admin/attendance', component: AdminAttendanceComponent },
      { path: 'admin/exams', component: AdminExamsComponent },
      { path: 'admin/compliance', component: AdminComplianceComponent },
      { path: 'admin/reports', component: AdminReportsComponent },
      { path: 'admin/notifications', component: AdminNotificationsComponent },
      { path: 'teacher/courses', component: AdminCoursesComponent },
      { path: 'teacher/materials', component: TeacherMaterialsComponent },
      { path: 'teacher/exams', component: AdminExamsComponent },
      { path: 'teacher/attendance', component: AdminAttendanceComponent },
      { path: 'teacher/students', component: AdminStudentsComponent },
      { path: 'teacher/performance', component: TeacherPerformanceComponent },
      { path: 'student/courses', component: StudentCoursesComponent },
      { path: 'student/exams', component: StudentExamsComponent },
      { path: 'student/grades', component: StudentGradesComponent },
      { path: 'student/attendance', component: StudentAttendanceComponent },
      { path: 'student/performance', component: StudentPerformanceComponent },
      { path: 'compliance/courses', component: AdminCoursesComponent },
      { path: 'compliance/students', component: AdminStudentsComponent },
      { path: 'compliance/records', component: ComplianceRecordsComponent },
      { path: 'compliance/audits', component: ComplianceAuditsComponent },
      { path: 'regulator/compliance', component: RegulatorComplianceComponent },
      { path: 'regulator/audits', component: RegulatorAuditsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
