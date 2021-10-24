import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { UsersService } from '../../services/users/users.service';

@NgModule({
    imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ],
    declarations:[RegisterComponent],
})
export class RegisterModule {}