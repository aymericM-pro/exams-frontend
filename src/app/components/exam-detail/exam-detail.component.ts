import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ExamService, QuestionDto } from '../../services/exam.service';
import { AppRoute } from '../../AppRoute';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.scss',
})
export class ExamDetailComponent {
  // --------------------------------------------------
  // STATE
  // --------------------------------------------------
  readonly answers = signal<Record<string, string | string[]>>({});
  readonly submitted = signal(false);
  readonly score = signal(0);
  // --------------------------------------------------
  readonly exam = computed(() => this.examResource.value()?.data ?? null);

  // --------------------------------------------------
  // INJECTIONS
  readonly createdAt = computed(() => {
    const exam = this.exam();
    return exam ? new Date(exam.createdAt).toLocaleDateString() : '';
  });
  readonly totalQuestions = computed(() => this.exam()?.questions.length ?? 0);
  readonly totalMCQ = computed(
    () => this.exam()?.questions.filter((q) => q.answers?.length).length ?? 0,
  );

  // --------------------------------------------------
  // RESOURCE
  readonly totalOpen = computed(
    () => this.exam()?.questions.filter((q) => !q.answers?.length).length ?? 0,
  );

  // --------------------------------------------------
  // DERIVED DATA (computed)
  protected readonly String = String;
  // --------------------------------------------------
  private readonly route = inject(ActivatedRoute);
  private readonly examService = inject(ExamService);
  // --------------------------------------------------
  readonly examResource = this.examService.exam;
  private readonly navigation = inject(NavigationService);

  // --------------------------------------------------
  // INIT

  // --------------------------------------------------
  constructor() {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      // minimalisme assumé : pilotage direct du signal
      this.examService.examId.set(examId);
    }

    effect(() => {
      console.log('Exam loaded:', this.exam());
    });
  }

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------
  goBack(): void {
    this.navigation.goTo(AppRoute.EXAMS);
  }

  // --------------------------------------------------
  // ANSWERS HANDLERS
  // --------------------------------------------------
  setSingleAnswer(questionId: string | number, answerId: string | number): void {
    this.answers.update((v) => ({
      ...v,
      [questionId]: String(answerId),
    }));
  }

  toggleMultipleAnswer(questionId: string | number, answerId: string | number): void {
    const current = (this.answers()[String(questionId)] as string[]) ?? [];

    this.answers.update((v) => ({
      ...v,
      [questionId]: current.includes(String(answerId))
        ? current.filter((id) => id !== String(answerId))
        : [...current, String(answerId)],
    }));
  }

  isMultipleSelected(questionId: string | number, answerId: string | number): boolean {
    const value = this.answers()[String(questionId)];
    return Array.isArray(value) && value.includes(String(answerId));
  }

  setTextAnswer(questionId: string | number, value: string): void {
    this.answers.update((v) => ({
      ...v,
      [questionId]: value,
    }));
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------
  submitExam(): void {
    const exam = this.exam();
    if (!exam) return;

    let correct = 0;

    exam.questions.forEach((q: QuestionDto) => {
      if (!q.questionId || !q.answers?.length) return;

      const correctIds = q.answers
        .filter((a) => a.correct && a.answerId)
        .map((a) => a.answerId!)
        .sort();

      const userValue = this.answers()[q.questionId];
      const userIds = Array.isArray(userValue)
        ? [...userValue].sort()
        : userValue
          ? [userValue]
          : [];

      if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
        correct++;
      }
    });

    this.score.set(correct);
    this.submitted.set(true);
  }
}
