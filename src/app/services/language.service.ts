import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public currentLanguageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('lang') || 'ru');
  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();
    const lang =  savedLang || (browserLang?.match(/en|ru/) ? browserLang : 'ru');

    this.translate.setDefaultLang('ru');
    this.translate.use(lang); // this is key
  }

  setLanguage(lang: string) {
    this.currentLanguageSubject.next(lang);
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getCurrentLanguage(): Observable<string> {
    // Return the current language from the BehaviorSubject
    this.currentLanguageSubject.next(localStorage.getItem('lang') || 'ru');
    return of(this.translate.currentLang);
  }
}
