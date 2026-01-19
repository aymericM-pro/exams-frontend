import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavigationService } from './navigation.service';
import { AppRoute } from '../AppRoute';

describe('NavigationService', () => {
  let service: NavigationService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NavigationService, { provide: Router, useValue: router }],
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('navigates to route without extras', () => {
    service.goTo(AppRoute.EXAMS);

    expect(router.navigate).toHaveBeenCalledWith(['/exams'], undefined);
  });

  it('navigates to route with navigation extras', () => {
    service.goTo(AppRoute.CLASS_CREATE, {
      queryParams: { mode: 'edit', classId: '123' },
    });

    expect(router.navigate).toHaveBeenCalledWith(['/classes/create'], {
      queryParams: { mode: 'edit', classId: '123' },
    });
  });
});
