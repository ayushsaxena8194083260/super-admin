import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports:[CommonModule,FormsModule,FooterComponent,RouterModule]
})
export class SidenavComponent {
  userName =   localStorage.getItem('userName');

  constructor(private readonly router: Router) {}
  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
