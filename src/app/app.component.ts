import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth/auth.service';
import { User } from './interface/user.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  username = ""
  email = ""
  user: User | null
  profileImage = ""
  isLoggedIn = false

  private userSubscription: Subscription = new Subscription()

  constructor(private router: Router, private service: AuthService) {

    this.user = service.getCurrentUserValue()
    this.username = this.user?.username!
    this.email = this.user?.email!
    this.profileImage = this.user?.profile_image || ""
    this.isLoggedIn = service.isLoggedIn()
  }

  ngOnInit() {
    this.userSubscription = this.service.getCurrentUser().subscribe(user => {
      this.user = user
      this.username = user?.username || ""
      this.email = user?.email || ""
      this.profileImage = this.user?.profile_image || ""
      this.isLoggedIn = this.service.isLoggedIn()
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
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
