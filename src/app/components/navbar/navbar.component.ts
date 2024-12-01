import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports:[CommonModule,FormsModule,FooterComponent]
})
export class NavbarComponent {
userName =   localStorage.getItem('userName');
}
