import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls:['./register.component.css'],
  providers: [UsersService],
  
})
export class RegisterComponent {

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private userService: UsersService) { 
   
  }

  onRegister(){
    const {email, password} = this.registerForm.value;
    this.userService.register(email,password);
  }

}
