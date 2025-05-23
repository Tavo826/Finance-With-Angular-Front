import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  username = ""
  email = ""

  constructor(private router: Router, private service: AuthService) {
    this.username = service.getUsername()!
    this.email = service.getEmail()!
  }

  title = 'personal-finance';

  HomeClick() {
    this.router.navigate(['Home']);
  }

  ViewUser(event: Event){
    event.preventDefault()
    this.router.navigate(['ViewUser'])
  }

  Logout() {
    this.service.logout()
  }
}
