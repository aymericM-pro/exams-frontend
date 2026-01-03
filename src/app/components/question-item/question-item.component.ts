import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Answer, Question } from '../../models/exam.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnswerItemComponent } from '../answer-item/anwser-item.component';

@Component({
  selector: 'app-question-item',
  standalone: true,
  imports: [CommonModule, FormsModule, AnswerItemComponent],
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss'],
})
export class QuestionItemComponent implements OnChanges {
  @Input({ required: true }) question!: Question;
  @Output() remove = new EventEmitter<void>();

  ngOnChanges(): void {
    this.syncAnswersWithType();
  }

  onTypeChange(): void {
    this.syncAnswersWithType();
  }

  addAnswer(): void {
    this.question.answers.push(this.createAnswer());
  }

  removeAnswer(index: number): void {
    this.question.answers.splice(index, 1);
  }

  private syncAnswersWithType(): void {
    if (this.question.type === 'text') {
      this.question.answers = [];
    } else if (this.question.answers.length === 0) {
      this.question.answers.push(this.createAnswer());
    }
  }

  private createAnswer(): Answer {
    return { id: Date.now(), text: '', correct: false };
  }
}
