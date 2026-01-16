import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.scss',
})
export class ExamDetailComponent {
  // ===== state =====
  readonly answers = signal<Record<string, string | string[]>>({});
  readonly submitted = signal(false);
  readonly score = signal(0);
  readonly createdAt = computed(() => {
    const exam = this.exam();
    return exam ? new Date(exam.createdAt).toLocaleDateString() : '';
  });
  readonly totalQuestions = computed(() => this.exam()?.questions.length ?? 0);
  readonly totalMCQ = computed(
    () => this.exam()?.questions.filter((q) => q.answers?.length).length ?? 0,
  );
  readonly totalOpen = computed(
    () => this.exam()?.questions.filter((q) => !q.answers?.length).length ?? 0,
  );
  protected readonly String = String;
  private readonly route = inject(ActivatedRoute);
  readonly examId = this.route.snapshot.paramMap.get('id');
  private readonly router = inject(Router);
  private readonly examService = inject(ExamService);
  readonly exam = this.examService.exam;

  constructor() {
    if (this.examId) {
      this.examService.loadExamById(this.examId);
    }

    effect(() => {
      console.log('Exam loaded:', this.exam());
    });
  }

  // ===== navigation =====
  goBack(): void {
    this.router.navigate(['/exams']);
  }

  // ===== answers handlers =====
  setSingleAnswer(questionId: string | number, answerId: string | number): void {
    this.answers.update((v) => ({
      ...v,
      [questionId]: String(answerId),
    }));
  }

  toggleMultipleAnswer(questionId: string | number, answerId: string | number): void {
    const current = (this.answers()[questionId] as string[]) ?? [];

    this.answers.update((v) => ({
      ...v,
      [questionId]: current.includes(String(answerId))
        ? current.filter((id) => id !== String(answerId))
        : [...current, String(answerId)],
    }));
  }

  isMultipleSelected(questionIndex: number, answerIndex: number): boolean {
    const value = this.answers()[questionIndex.toString()];
    return Array.isArray(value) && value.includes(answerIndex.toString());
  }

  setTextAnswer(questionId: string | number, value: string): void {
    this.answers.update((v) => ({ ...v, [questionId]: value }));
  }

  // ===== submit =====
  submitExam(): void {
    const exam = this.exam();
    if (!exam) return;

    let correct = 0;

    exam.questions.forEach((q) => {
      if (!q.questionId || !q.answers?.length) return;

      const correctIds = q.answers
        .filter((a) => a.correct && a.answerId)
        .map((a) => a.answerId!)
        .sort();

      const userValue = this.answers()[q.questionId];
      const userIds = Array.isArray(userValue) ? [...userValue].sort() : [userValue];

      if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
        correct++;
      }
    });

    this.score.set(correct);
    this.submitted.set(true);
  }
}
