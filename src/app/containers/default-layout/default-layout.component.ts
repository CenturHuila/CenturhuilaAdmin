import {Component} from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers: [UsersService],
})


export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(private userService: UsersService) { }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout(){
    this.userService.logout();
  }
}
