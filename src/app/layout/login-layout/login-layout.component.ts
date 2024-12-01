import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  standalone: true,
  imports: [RouterModule,CommonModule],
})
export class LoginLayoutComponent {}
