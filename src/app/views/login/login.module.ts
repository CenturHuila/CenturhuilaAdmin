//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { routesLogin } from './login-routing.module';

@NgModule({
    imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routesLogin),
    ],
    declarations:[LoginComponent],
    exports: [RouterModule]
})
export class LoginModule {}