import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  providers: [],
  imports: [
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatRadioModule,
    
  ],

  exports: [
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    
  ],
})
export class MaterialModel {}
