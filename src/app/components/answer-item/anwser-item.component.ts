import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

@Component({
  selector: 'app-answer-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-item.component.html',
  styleUrl: './answer-item.component.scss',
})
export class AnswerItemComponent {
  @Input({ required: true }) answer!: Answer;
  @Input({ required: true }) type!: 'single' | 'multiple';

  @Output() answerChange = new EventEmitter<Answer>();
  @Output() remove = new EventEmitter<void>();
  protected readonly HTMLInputElement = HTMLInputElement;

  updateText(value: string): void {
    this.answerChange.emit({ ...this.answer, text: value });
  }

  toggleCorrect(): void {
    this.answerChange.emit({ ...this.answer, correct: !this.answer.correct });
  }
}
