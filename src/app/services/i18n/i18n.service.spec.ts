import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { translations } from '../i18n';
import { I18nService } from './I18nService.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService],
    });

    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language (fr)', () => {
    expect(service.currentLang()).toBe('fr');
  });

  it('should expose french translations by default', () => {
    expect(service.t()).toBe(translations.fr);
    expect(service.t().common.cancel).toBe('Annuler');
  });

  it('should switch to english when setLang(en) is called', () => {
    service.setLang('en');

    expect(service.currentLang()).toBe('en');
    expect(service.t()).toBe(translations.en);
    expect(service.t().common.cancel).toBe('Cancel');
  });

  it('should reactively update translations when language changes', () => {
    // état initial
    expect(service.t().class.createTitle).toBe('Créer une classe');

    // changement de langue
    service.setLang('en');

    // signal recomputé automatiquement
    expect(service.t().class.createTitle).toBe('Create class');
  });
});
