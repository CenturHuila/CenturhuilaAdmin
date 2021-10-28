//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

@NgModule({
    imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ],
    declarations:[LoginComponent]
})
export class LoginModule {}