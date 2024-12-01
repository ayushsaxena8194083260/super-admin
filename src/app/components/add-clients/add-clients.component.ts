import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/bonus.service';

@Component({
  selector: 'app-add-clients',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,],
  templateUrl: './add-clients.component.html',
  styleUrl: './add-clients.component.scss'
})
export class AddClientsComponent {
  clientForm!: FormGroup;
  token = localStorage.getItem('token');
  constructor(
    private readonly fb: FormBuilder,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly toaster: ToastrService
  ) {}

  ngOnInit(): void {
    const storedClientId = localStorage.getItem('clientID');
    if (!storedClientId) {
      console.error('Client ID not found in localStorage!');
      return;
    }
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mvp_points: ['', Validators.required],
      acquisition_fee: ['', Validators.required],
      referral_bonus: ['', Validators.required],
      community_cashback: ['', Validators.required],
      client_id: [storedClientId, Validators.required], //
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.apiService.makeApiRequest('POST', 'addClient', this.clientForm.value,{},this.token).subscribe(
        (response) => {
          console.log('Client added successfully:', response);
          this.toaster.success('Client added successfully');
          this.router.navigate(['/clients']); // Redirect to table page
        },
        (error) => {
          this.toaster.error('Error adding client');
          console.error('Error adding client:', error);
        }
      );
    }
  }
}
