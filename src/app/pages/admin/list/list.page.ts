import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  users: Observable<any>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.users = this.authService.getUsers();
  }

  deleteUser(id) {
    this.authService.deleteUser(id);
  }
  
  signOut() {
    this.authService.signOut();
  }
  
}
