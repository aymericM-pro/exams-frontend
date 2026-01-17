import { NavigationService } from './navigation.service';
import { AppRoute } from '../AppRoute';
import { describe, expect, it, vi } from 'vitest';

describe('NavigationService', () => {
  it('navigates to route', () => {
    const router = { navigate: vi.fn() };
    const service = new NavigationService(router as any);

    service.goTo(AppRoute.EXAMS);

    expect(router.navigate).toHaveBeenCalledWith(['/exams'], undefined);
  });
});
