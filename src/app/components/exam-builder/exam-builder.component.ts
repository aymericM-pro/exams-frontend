import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/exam.model';
import { QuestionItemComponent } from '../question-item/question-item.component';

@Component({
  selector: 'app-exam-builder',
  standalone: true,
  imports: [CommonModule, QuestionItemComponent],
  templateUrl: './exam-builder.component.html',
  styleUrls: ['./exam-builder.component.scss'],
})
export class ExamBuilderComponent {
  questions: Question[] = [];

  addQuestion(): void {
    this.questions.push({
      id: Date.now(),
      title: '',
      type: 'single',
      answers: [{ id: Date.now(), text: '', correct: false }],
    });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  importCsv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    console.log('CSV selected:', file.name);

    const reader = new FileReader();
    reader.onload = () => {
      console.log('CSV content:\n', reader.result);
    };
    reader.readAsText(file);
  }

  saveExam(): void {
    console.log('📝 Exam data:', JSON.stringify(this.questions, null, 2));
    alert('Exam saved! Check console for JSON output.');
  }
}
