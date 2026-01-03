import {Component, computed, effect, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExamStore } from './exam.store';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent {

  semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
  selectedSemester = signal('S1');

  exams = computed(() => this.examStore.exams);

  filteredExams = computed(() =>
    this.exams().filter(e => e.semester === this.selectedSemester())
  );

  constructor(
    private examStore: ExamStore,
    private router: Router
  ) {

    effect(() => {
      console.log('📚 Tous les exams :', this.exams());
    });

    effect(() => {
      console.log(
        `🎯 Exams pour ${this.selectedSemester()} :`,
        this.filteredExams()
      );
    });
  }

  selectSemester(s: string): void {
    this.selectedSemester.set(s);
  }

  openExam(id: string): void {
    this.router.navigate(['/exams', id]);
  }

  deleteExam(id: string): void {
    if (confirm('Delete this exam?')) {
      this.examStore.deleteExam(id);
    }
  }
}
