import { Routes } from '@angular/router';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { ExamBuilderComponent } from './components/exam-builder/exam-builder.component';
import { UpcomingExamsComponent } from './components/upcoming-exams/upcoming-exams.component';

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
      { path: ':id', component: ExamDetailComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'exams',
  },
];
