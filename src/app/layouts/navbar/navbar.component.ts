import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LanguageService } from 'src/app/services/language.service';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { ThemeSwitcherComponent } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    SharedModule,
    DxToolbarModule,
    DxButtonModule,
    ThemeSwitcherComponent,
    DxSelectBoxModule,
  ],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly colorMode = [];
  menuOpened!: boolean;
  title = 'eStima';

  languages = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'uz', label: 'UZ' },
  ];
  currentLang =
    computed(() => this.languageService.getCurrentLanguage()) || 'en';

  constructor(private languageService: LanguageService) {}

  changeLang(lang: string): void {
    this.currentLang = lang;
    this.languageService.setLanguage(lang);
  }
}
