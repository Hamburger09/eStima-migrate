import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LanguageService } from 'src/app/services/language.service';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { ThemeSwitcherComponent } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    SharedModule,
    DxToolbarModule,
    DxButtonModule,
    ThemeSwitcherComponent,
    DxDropDownButtonModule,
  ],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private languageService = inject(LanguageService);
  readonly colorMode = [];
  menuOpened!: boolean;
  title = 'eStima';

  // Language options
  languageOptions = [
    { id: 'en', text: '🇬🇧 English', icon: '🇬🇧' },
    { id: 'ru', text: '🇷🇺 Русский', icon: '🇷🇺' },
    { id: 'uz', text: "🇺🇿 O'zbek", icon: '🇺🇿' },
  ];
  currentLang = 'en';

  constructor() {
    // Get current language
    this.languageService.getCurrentLanguage().subscribe((lang) => {
      this.currentLang = lang;
    });
  }
  onLanguageChange(e: any) {
    const selectedLang = e.item.id;
    this.languageService.setLanguage(selectedLang);
    this.currentLang = selectedLang;
  }
  get selectedLanguage() {
    return this.languageOptions.find((lang) => lang.id === this.currentLang);
  }
}
