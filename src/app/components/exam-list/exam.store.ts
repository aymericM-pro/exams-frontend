import {Injectable, signal} from '@angular/core';
import {Exam} from '../../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamStore {

  private readonly _exams = signal<Exam[]>([
    {
      id: 'exam-1',
      title: 'JavaScript Fundamentals',
      description: 'Basic concepts of JS, from variables to functions.',
      semester: 'S1',
      createdAt: new Date(),
      questions: [
        {
          id: 1,
          title: 'What is a closure?',
          type: 'single',
          answers: [
            { id: 1, text: 'A function with preserved lexical scope', correct: true },
            { id: 2, text: 'A JavaScript loop', correct: false },
            { id: 3, text: 'A DOM element', correct: false }
          ]
        },
        {
          id: 2,
          title: 'Which of the following are JavaScript primitive types?',
          type: 'multiple',
          answers: [
            { id: 1, text: 'string', correct: true },
            { id: 2, text: 'number', correct: true },
            { id: 3, text: 'object', correct: false },
            { id: 4, text: 'boolean', correct: true }
          ]
        },
        {
          id: 3,
          title: 'What does `===` do in JavaScript?',
          type: 'single',
          answers: [
            { id: 1, text: 'Compares value and type', correct: true },
            { id: 2, text: 'Compares only value', correct: false },
            { id: 3, text: 'Assigns a value', correct: false }
          ]
        },
        {
          id: 4,
          title: 'Explain the difference between var, let and const.',
          type: 'text',
          answers: []
        },
        {
          id: 5,
          title: 'Which array methods return a new array?',
          type: 'multiple',
          answers: [
            { id: 1, text: 'map', correct: true },
            { id: 2, text: 'filter', correct: true },
            { id: 3, text: 'forEach', correct: false },
            { id: 4, text: 'reduce', correct: false }
          ]
        },
        {
          id: 6,
          title: 'What is the output of `typeof null`?',
          type: 'single',
          answers: [
            { id: 1, text: 'object', correct: true },
            { id: 2, text: 'null', correct: false },
            { id: 3, text: 'undefined', correct: false }
          ]
        },
        {
          id: 7,
          title: 'What is a Promise?',
          type: 'single',
          answers: [
            { id: 1, text: 'An object representing an async operation', correct: true },
            { id: 2, text: 'A synchronous loop', correct: false },
            { id: 3, text: 'A callback function', correct: false }
          ]
        },
        {
          id: 8,
          title: 'Which keywords are used for asynchronous code?',
          type: 'multiple',
          answers: [
            { id: 1, text: 'async', correct: true },
            { id: 2, text: 'await', correct: true },
            { id: 3, text: 'defer', correct: false },
            { id: 4, text: 'yield', correct: false }
          ]
        },
        {
          id: 9,
          title: 'What does the spread operator (...) do?',
          type: 'single',
          answers: [
            { id: 1, text: 'Expands iterable elements', correct: true },
            { id: 2, text: 'Creates a loop', correct: false },
            { id: 3, text: 'Defines a function', correct: false }
          ]
        },
        {
          id: 10,
          title: 'Describe event bubbling in JavaScript.',
          type: 'text',
          answers: []
        }
      ]
    }
  ]);

  get exams() {
    return this._exams();
  }

  getExamById(id: string) {
    return this._exams().find(e => e.id === id);
  }

  addExam(exam: Exam) {
    this._exams.update(e => [...e, exam]);
  }

  deleteExam(id: string) {
    this._exams.update(e => e.filter(x => x.id !== id));
  }
}
