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
  // ===== mode =====
  readonly mode = signal<'take' | 'view' | 'review'>('take');
  readonly isReadonly = computed(() => this.mode() === 'view' || this.mode() === 'review');

  // ===== state =====
  readonly answers = signal<Record<number, string | string[]>>({});
  readonly submitted = signal(false);
  readonly canSubmit = computed(() => this.mode() === 'take' && !this.submitted());
  readonly score = signal(0);
  // ===== computed UI =====
  readonly createdAt = computed(() =>
    this.exam() ? new Date(this.exam()!.createdAt).toLocaleDateString() : '',
  );
  readonly totalQuestions = computed(() => this.exam()?.questions.length ?? 0);
  readonly totalMCQ = computed(
    () => this.exam()?.questions.filter((q) => q.answers?.length).length ?? 0,
  );
  readonly totalOpen = computed(
    () => this.exam()?.questions.filter((q) => !q.answers?.length).length ?? 0,
  );
  protected readonly String = String;
  // ===== routing & services =====
  private readonly route = inject(ActivatedRoute);
  readonly examId = this.route.snapshot.paramMap.get('id');
  private readonly router = inject(Router);
  private readonly examService = inject(ExamService);
  readonly exam = this.examService.exam;

  constructor() {
    // ---- read mode ----
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    if (modeParam === 'view' || modeParam === 'review') {
      this.mode.set(modeParam);
    }

    // ---- load exam ----
    if (this.examId) {
      this.examService.loadExamById(this.examId);
    }

    // ---- log loaded exam ----
    effect(() => {
      if (this.exam()) {
        console.log('📘 Exam loaded:', this.exam());
      }
    });

    // ---- prefill correct answers in review mode ----
    effect(() => {
      if (this.mode() === 'review' && this.exam()) {
        this.prefillCorrectAnswers();
      }
    });
  }

  // ===== navigation =====
  goBack(): void {
    this.router.navigate(['/exams']);
  }

  // ===== answer helpers =====
  setSingleAnswer(questionIndex: number, answerIndex: number): void {
    if (this.isReadonly()) return;

    this.answers.update((v) => ({
      ...v,
      [questionIndex]: String(answerIndex),
    }));
  }

  toggleMultipleAnswer(questionIndex: number, answerIndex: number): void {
    if (this.isReadonly()) return;

    const current = (this.answers()[questionIndex] as string[]) ?? [];

    this.answers.update((v) => ({
      ...v,
      [questionIndex]: current.includes(String(answerIndex))
        ? current.filter((id) => id !== String(answerIndex))
        : [...current, String(answerIndex)],
    }));
  }

  isMultipleSelected(questionIndex: number, answerIndex: number): boolean {
    const value = this.answers()[questionIndex];
    return Array.isArray(value) && value.includes(String(answerIndex));
  }

  setTextAnswer(questionIndex: number, value: string): void {
    if (this.isReadonly()) return;

    this.answers.update((v) => ({
      ...v,
      [questionIndex]: value,
    }));
  }

  // ===== submit =====
  submitExam(): void {
    if (this.isReadonly()) return;

    const exam = this.exam();
    if (!exam) return;

    let correct = 0;

    exam.questions.forEach((q, qi) => {
      if (!q.answers?.length) return;

      const correctIds = q.answers
        .map((a, ai) => (a.correct ? String(ai) : null))
        .filter(Boolean)
        .sort();

      const userValue = this.answers()[qi];
      const userIds = Array.isArray(userValue) ? [...userValue].sort() : [userValue];

      if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
        correct++;
      }
    });

    this.score.set(correct);
    this.submitted.set(true);
  }

  // ===== view / review helpers =====
  isCorrectAnswer(questionIndex: number, answerIndex: number): boolean {
    const exam = this.exam();
    if (!exam) return false;

    return !!exam.questions[questionIndex]?.answers?.[answerIndex]?.correct;
  }

  shouldHighlightCorrect(questionIndex: number, answerIndex: number): boolean {
    return this.mode() === 'view' && this.isCorrectAnswer(questionIndex, answerIndex);
  }

  private prefillCorrectAnswers(): void {
    const exam = this.exam();
    if (!exam) return;

    const prefilled: Record<number, string | string[]> = {};

    exam.questions.forEach((q, qi) => {
      if (!q.answers?.length) return;

      const correctIndexes = q.answers
        .map((a, ai) => (a.correct ? String(ai) : null))
        .filter(Boolean) as string[];

      if (q.type === 'single') {
        prefilled[qi] = correctIndexes[0] ?? '';
      } else if (q.type === 'multiple') {
        prefilled[qi] = correctIndexes;
      }
    });

    this.answers.set(prefilled);
  }
}
