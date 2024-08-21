import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';





@NgModule({
  declarations: [],
  imports: [
    MatInputModule,
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    NgForOf,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CommonModule,
    


    
     ],
  exports: [
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    NgForOf,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CommonModule,
  ]
})
export class AppModule { }
