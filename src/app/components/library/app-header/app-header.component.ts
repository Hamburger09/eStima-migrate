import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import {
  DxDropDownButtonModule,
  DxDropDownButtonComponent,
} from 'devextreme-angular/ui/drop-down-button';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { AuthService } from 'src/app/services';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeSwitcherComponent } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [
    CommonModule,
    DxButtonModule,
    DxToolbarModule,
    DxDropDownButtonModule,
    ThemeSwitcherComponent,
  ],
})
export class AppHeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  userClientId: string | null = null;
  currentLanguage = 'en';

  // Language options
  languageOptions = [
    { id: 'en', text: '🇬🇧 English', icon: '🇬🇧' },
    { id: 'ru', text: '🇷🇺 Русский', icon: '🇷🇺' },
    { id: 'uz', text: "🇺🇿 O'zbek", icon: '🇺🇿' },
  ];

  // Profile menu items
  profileMenuItems: any[] = [];

  ngOnInit() {
    // Get user client ID
    this.userClientId = this.authService.getUserClientIdFromStorage();

    // Get current language
    this.languageService.getCurrentLanguage().subscribe((lang) => {
      this.currentLanguage = lang;
    });

    // Build profile menu
    this.profileMenuItems = [
      {
        text: 'Profile',
        icon: 'user',
        onClick: () => this.goToProfile(),
      },
      {
        text: 'Logout',
        icon: 'runner',
        onClick: () => this.authService.logout(),
      },
    ];
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };

  onLanguageChange(e: any) {
    const selectedLang = e.item.id;
    this.languageService.setLanguage(selectedLang);
    this.currentLanguage = selectedLang;
  }

  onProfileMenuClick(e: any) {
    if (e.itemData?.onClick) {
      e.itemData.onClick();
    }
  }

  goToProfile() {
    // Navigate to profile page
    this.router.navigate(['/user-profile']);
  }

  get selectedLanguage() {
    return this.languageOptions.find(
      (lang) => lang.id === this.currentLanguage
    );
  }
}
