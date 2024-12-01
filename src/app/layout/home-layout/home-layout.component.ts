import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SidenavComponent } from 'src/app/components/sidenav/sidenav.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    SidenavComponent,
    NavbarComponent,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
  ],
})
export class HomeLayoutComponent {
  title = 'pro-dashboard-angular';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= true;
  isCollapsed = true;
  userName =   localStorage.getItem('userName');

  constructor(private readonly observer: BreakpointObserver,private readonly router: Router) {}
  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }
  // getClasses() {
  //   const classes = {
  //     'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
  //     'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled,
  //   };
  //   return classes;
  // }
  // toggleSidebar() {
  //   this.appService.toggleSidebar();
  // }
}
