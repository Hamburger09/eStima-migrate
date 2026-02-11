import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  DxButtonModule,
  DxMultiViewModule,
  DxFormModule,
  DxTextBoxModule,
  DxSelectBoxModule,
} from 'devextreme-angular';
import { DxStepperModule, DxStepperTypes } from 'devextreme-angular/ui/stepper';
import validationEngine from 'devextreme/ui/validation_engine';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../interfaces/TypesABase.interface';
import { LoadingService } from '../../../services/loading.service';
import { AuthService } from '../../../services/auth.service';
import { ErrorToastComponent } from 'src/app/components/library/error-toast/error-toast.component';
import { MessageToastComponent } from 'src/app/components/library/message-toast/message-toast.component';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    DxButtonModule,
    DxMultiViewModule,
    DxStepperModule,
    DxFormModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    ErrorToastComponent,
    MessageToastComponent,
  ],
})
export class CreateAccountFormComponent implements OnInit {
  // Stepper configuration
  steps: DxStepperTypes.Item[];
  selectedIndex = 0;
  isStepperReadonly = false;
  validationGroups = ['account', 'profile', 'verification'];

  // Signals
  showSuccessMessage = signal<boolean>(false);
  timer = signal<number>(60);
  countries = signal<Country[]>([]);

  // Form Data
  accountFormData: any = {
    user_login: '',
    user_password: '',
    user_confirm_password: '',
  };

  profileFormData: any = {
    fio_1: '',
    fio_2: '',
    fio_3: '',
    user_mail: '',
    id_country: null,
    user_tel: '',
  };

  emailFormData: any = {
    code: '',
  };

  // State
  tempUserId: string | null = null;
  hidePassword = true;
  hideConfirmPassword = true;
  private timerInterval: any;

  // Editor Options (with mask rules defined here)
  phoneMaskRules = { '0': /[0-9]/ };
  codeMaskRules = { '0': /[0-9]/ };

  phoneEditorOptions = {
    placeholder: 'Phone Number',
    mode: 'tel',
    stylingMode: 'outlined',
    mask: '+000 00 000 00 00',
    maskRules: this.phoneMaskRules,
  };

  verificationCodeEditorOptions = {
    placeholder: 'Enter verification code',
    stylingMode: 'outlined',
    mask: '000000',
    maskRules: this.codeMaskRules,
  };

  countryEditorOptions = {
    dataSource: [] as Country[],
    displayExpr: 'name',
    valueExpr: 'id',
    placeholder: 'Select a country',
    searchEnabled: true,
    stylingMode: 'outlined',
  };

  // Password toggle buttons
  passwordButtons = [
    {
      name: 'password',
      location: 'after',
      options: {
        icon: this.hidePassword ? 'eyeopen' : 'eyeclose',
        type: 'default',
        onClick: () => {
          this.hidePassword = !this.hidePassword;
          this.updatePasswordButtons();
        },
      },
    },
  ];

  confirmPasswordButtons = [
    {
      name: 'password',
      location: 'after',
      options: {
        icon: this.hideConfirmPassword ? 'eyeopen' : 'eyeclose',
        type: 'default',
        onClick: () => {
          this.hideConfirmPassword = !this.hideConfirmPassword;
          this.updateConfirmPasswordButtons();
        },
      },
    },
  ];

  constructor(
    private router: Router,
    private countryService: CountryService,
    private authService: AuthService,
    public loadingService: LoadingService
  ) {
    this.steps = this.getInitialSteps();
  }

  ngOnInit(): void {
    this.getCountries();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  getInitialSteps(): DxStepperTypes.Item[] {
    return [
      {
        label: 'Account',
        icon: 'user',
        isValid: undefined,
      },
      {
        label: 'Profile',
        icon: 'card',
        isValid: undefined,
      },
      {
        label: 'Verification',
        icon: 'check',
        isValid: undefined,
      },
      {
        label: 'Complete',
        icon: 'tips',
        isValid: undefined,
      },
    ];
  }

  getCountries(): void {
    this.countryService.getCountries().subscribe((countries: Country[]) => {
      this.countries.set(countries);
      this.countryEditorOptions.dataSource = countries;
    });
  }

  // Validation
  getValidationResult(index: number): boolean {
    if (index >= this.validationGroups.length) {
      return true;
    }
    return validationEngine.validateGroup(this.validationGroups[index]).isValid;
  }

  setStepValidationResult(index: number, isValid: boolean | undefined): void {
    this.steps[index].isValid = isValid;
  }

  onSelectionChanging(e: DxStepperTypes.SelectionChangingEvent): void {
    const { component, addedItems, removedItems } = e;
    const { items = [] } = component.option();
    const addedIndex = items.findIndex(
      (item: DxStepperTypes.Item) => item === addedItems[0]
    );
    const removedIndex = items.findIndex(
      (item: DxStepperTypes.Item) => item === removedItems[0]
    );
    const isMoveForward = removedIndex > -1 && addedIndex > removedIndex;

    if (isMoveForward) {
      const isValid = this.getValidationResult(removedIndex);
      this.setStepValidationResult(removedIndex, isValid);
      if (isValid === false) {
        e.cancel = true;
      }
    }
  }

  // Password validation
  passwordComparison = () => {
    return this.accountFormData.user_password;
  };

  validatePasswordStrength = (params: any): boolean => {
    const password = params.value;
    if (!password) return false;

    const hasMinLength = password.length >= 8;
    const hasNumeric = /\d/.test(password);

    return hasMinLength && hasNumeric;
  };

  updatePasswordButtons(): void {
    this.passwordButtons = [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: this.hidePassword ? 'eyeopen' : 'eyeclose',
          type: 'default',
          onClick: () => {
            this.hidePassword = !this.hidePassword;
            this.updatePasswordButtons();
          },
        },
      },
    ];
  }

  updateConfirmPasswordButtons(): void {
    this.confirmPasswordButtons = [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: this.hideConfirmPassword ? 'eyeopen' : 'eyeclose',
          type: 'default',
          onClick: () => {
            this.hideConfirmPassword = !this.hideConfirmPassword;
            this.updateConfirmPasswordButtons();
          },
        },
      },
    ];
  }

  // Timer functions
  startTimer(): void {
    this.timer.set(60);
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      this.timer.update((value) => {
        if (value <= 1) {
          this.clearTimer();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resendVerificationCode(): void {
    if (this.tempUserId) {
      this.authService
        .resendVerificationCode(this.profileFormData.user_mail)
        .subscribe({
          next: () => {
            console.log('Verification code resent successfully.');
            this.startTimer();
          },
          error: (err) => {
            console.error('Error resending verification code:', err);
          },
        });
    }
  }

  // Navigation
  getNextButtonText(): string {
    if (this.selectedIndex < this.steps.length - 1) {
      return 'Next';
    }
    return this.showSuccessMessage() ? 'Go to Login' : 'Finish Registration';
  }

  onPrevButtonClick(): void {
    this.selectedIndex -= 1;
  }

  moveNext(): void {
    const isValid = this.getValidationResult(this.selectedIndex);
    this.setStepValidationResult(this.selectedIndex, isValid);

    if (isValid) {
      this.selectedIndex += 1;
    }
  }

  onNextButtonClick(): void {
    if (this.showSuccessMessage()) {
      // Redirect to login
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    if (this.selectedIndex === 0) {
      // Step 1: Account
      this.onStep1Submit();
    } else if (this.selectedIndex === 1) {
      // Step 2: Profile
      this.onStep2Submit();
    } else if (this.selectedIndex === 2) {
      // Step 3: Verification
      this.onStep3Submit();
    }
  }

  // Step submissions
  onStep1Submit(): void {
    const isValid = this.getValidationResult(this.selectedIndex);
    this.setStepValidationResult(this.selectedIndex, isValid);

    if (!isValid) return;

    this.authService
      .registerStep1(
        this.accountFormData.user_login,
        this.accountFormData.user_password
      )
      .subscribe({
        next: ({ data }: any) => {
          console.log(data);
          this.tempUserId = data.tempUserId;
          this.selectedIndex += 1;
        },
        error: (err) => {
          console.error('Step 1 error:', err);
          this.setStepValidationResult(this.selectedIndex, false);
        },
      });
  }

  onStep2Submit(): void {
    const isValid = this.getValidationResult(this.selectedIndex);
    this.setStepValidationResult(this.selectedIndex, isValid);

    if (!isValid || !this.tempUserId) return;

    const payload = {
      ...this.profileFormData,
      tempUserId: this.tempUserId,
    };

    this.authService.registerStep2(payload).subscribe({
      next: (data) => {
        this.selectedIndex += 1;
        this.startTimer();
      },
      error: (err) => {
        console.error('Step 2 error:', err);
        this.setStepValidationResult(this.selectedIndex, false);
      },
    });
  }

  onStep3Submit(): void {
    const isValid = this.getValidationResult(this.selectedIndex);
    this.setStepValidationResult(this.selectedIndex, isValid);

    if (!isValid || !this.tempUserId) return;

    const payload = {
      ...this.emailFormData,
      tempUserId: this.tempUserId,
    };

    this.authService.registerStep3(payload).subscribe({
      next: (data: any) => {
        this.showSuccessMessage.set(true);
        this.setStepValidationResult(this.selectedIndex, true);
        this.selectedIndex += 1;
        this.isStepperReadonly = true;
        this.clearTimer();

        // Auto redirect after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/sign-in']);
        }, 3000);
      },
      error: (err) => {
        console.error('Step 3 error:', err);
        this.setStepValidationResult(this.selectedIndex, false);
      },
    });
  }
}
