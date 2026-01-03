import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamStore } from '../exam-list/exam.store';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ExamDetail.component.html',
  styleUrl: './ExamDetail.component.scss',
})
export class ExamDetailComponent {

  examId = computed(() => this.route.snapshot.paramMap.get('id')!);

  exam = computed(() => this.store.getExamById(this.examId()));

  answers = signal<Record<number, any>>({});
  submitted = signal(false);
  score = signal(0);

  createdAt = computed(() => {
    const exam = this.exam();
    if (!exam || !exam.createdAt) {
      return '';
    }
    return exam.createdAt.toLocaleDateString();
  });

  totalQuestions = computed(() => this.exam()?.questions.length ?? 0);

  totalMCQ = computed(
    () => this.exam()?.questions.filter(q => q.answers?.length).length ?? 0
  );

  totalOpen = computed(
    () =>
      this.exam()?.questions.filter(
        q => !q.answers || q.answers.length === 0
      ).length ?? 0
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: ExamStore
  ) {}

  goBack(): void {
    this.router.navigate(['/exams']);
  }

  /* ========= ANSWERS HANDLERS ========= */

  setSingleAnswer(questionId: number, answerId: number): void {
    this.answers.update(v => ({ ...v, [questionId]: answerId }));
  }

  toggleMultipleAnswer(questionId: number, answerId: number): void {
    const current = this.answers()[questionId] ?? [];

    this.answers.update(v => ({
      ...v,
      [questionId]: current.includes(answerId)
        ? current.filter((x: number) => x !== answerId)
        : [...current, answerId]
    }));
  }

  setTextAnswer(questionId: number, value: string): void {
    this.answers.update(v => ({ ...v, [questionId]: value }));
  }

  submitExam(): void {
    const exam = this.exam();
    if (!exam) return;

    let correct = 0;

    exam.questions.forEach(q => {
      if (q.answers?.length) {
        const correctIds = q.answers
          .filter(a => a.correct)
          .map(a => a.id)
          .sort();

        const userValue = this.answers()[q.id];
        const userIds = Array.isArray(userValue)
          ? [...userValue].sort()
          : [userValue];

        if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
          correct++;
        }
      }
    });

    this.score.set(correct);
    this.submitted.set(true);
  }
}
