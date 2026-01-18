import { Routes } from '@angular/router';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { ExamBuilderComponent } from './components/exam-builder/exam-builder.component';
import { UpcomingExamsComponent } from './components/upcoming-exams/upcoming-exams.component';
import { ProfessorExamsComponent } from './components/professor-exam/professor-exam.component';
import { DetailClassComponent } from './components/create-detail/detail-classes.component';
import { CreateClassComponent } from './components/create-class/create-classes.component';
import { ProfessorClassesComponent } from './components/professor-class/professor-classes.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'exams',
    pathMatch: 'full',
  },
  {
    path: 'exams',
    children: [
      { path: '', component: ExamListComponent },
      { path: 'builder', component: ExamBuilderComponent },
      { path: 'upcoming', component: UpcomingExamsComponent },
      { path: 'professor', component: ProfessorExamsComponent },
      { path: ':id', component: ExamDetailComponent },
    ],
  },
  {
    path: 'classes',
    children: [
      { path: 'create', component: CreateClassComponent },
      { path: 'detail', component: DetailClassComponent },
      { path: 'all-classes', component: ProfessorClassesComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'exams',
  },
];
