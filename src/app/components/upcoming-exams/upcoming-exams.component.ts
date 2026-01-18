import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ExamDto, ExamService } from '../../services/exam.service';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';

@Component({
  selector: 'app-upcoming-exams',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './upcoming-exams.component.html',
  styleUrls: ['./upcoming-exams.component.scss'],
})
export class UpcomingExamsComponent {
  readonly exams = computed<ExamDto[]>(() => this.examsResource.value()?.data ?? []);
  readonly loading = computed(() => this.examsResource.isLoading());
  readonly error = computed(() => this.examsResource.error());
  private readonly examService = inject(ExamService);
  readonly examsResource = this.examService.exams;
  private readonly navigation = inject(NavigationService);

  openExam(examId: string): void {
    this.navigation.goTo(`${AppRoute.EXAMS}/${examId}` as AppRoute);
  }

  startExam(examId: string): void {
    console.log('Start exam', examId); // futur : création de session + navigation
  }
}
