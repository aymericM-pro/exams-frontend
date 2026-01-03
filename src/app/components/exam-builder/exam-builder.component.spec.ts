import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ExamBuilderComponent } from './exam-builder.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExamBuilderComponent],
      providers: [provideRouter([])],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ExamBuilderComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
