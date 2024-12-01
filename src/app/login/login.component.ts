import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/bonus.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, MatFormFieldModule,
    MatSelectModule],
})
export class LoginComponent {
  public loginForm!: FormGroup;
  loading: boolean = false;
  public userEmail = localStorage.getItem('user')?.toString();
  hidePassword: boolean = true;
  clients: any[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly spinner: NgxSpinnerService,
    private readonly toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      client: ['', Validators.required]
    });
    this.onSubmit()
    this.fetchClients();
  }


  get formControls() {
    return this.loginForm.controls;
  }

  fetchClients(): void {
    const endpoint = 'clientsDropdown';

    this.apiService.makeApiRequest('GET', endpoint).subscribe({
      next: (response) => {
        this.clients = response.data;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  onSubmit() {
    this.loading = true;

    if (!this.userEmail) {
      if (this.loginForm.valid) {
        if (!this.loginForm.value.client) {
         this.toaster.error('Please select a client first.');
          this.loading = false;
          return;
        }

        this.spinner.show();

        this.apiService
          .makeApiRequest('POST', 'loginUser', this.loginForm.value)
          .subscribe((res) => {
            this.authService.login(this.loginForm.value.email);
            this.router.navigate(['/dashboard']);
            this.spinner.hide();
            localStorage.setItem('user', this.loginForm.value.email);
            localStorage.setItem('token', res.data.jwt);
            localStorage.setItem('userName', res.data.name);
            localStorage.setItem('clientID', this.loginForm.value.client);
          });
      }
    } else {
      this.authService.login(this.userEmail);
      this.router.navigate(['/dashboard']);
    }
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
