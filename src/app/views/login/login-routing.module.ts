import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

export const routesLogin: Routes = [
    {
        path:'',
        component: LoginComponent,
        data:{
            title:'login'
        }
    },
];

// @NgModule({
//     imports:[],
//     exports: [RouterModule]
// })
export class LoginRoutingngModule {}