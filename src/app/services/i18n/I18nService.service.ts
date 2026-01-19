import { computed, Injectable, signal } from '@angular/core';
import { Lang, translations } from '../i18n';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly lang = signal<Lang>('fr');

  readonly currentLang = computed(() => this.lang());

  readonly t = computed(() => translations[this.lang()]);

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }
}
