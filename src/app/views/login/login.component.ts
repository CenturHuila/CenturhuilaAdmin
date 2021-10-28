import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls:['./login.component.css'],
  providers: [UsersService],
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private userService: UsersService) { }

  onLogin(){
    const {email, password} = this.loginForm.value;
    this.userService.login(email,password);
    
  }
 }
