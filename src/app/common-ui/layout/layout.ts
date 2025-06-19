import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import {ProfileService} from '../../data/services/profile-service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  profileService = inject(ProfileService);

  ngOnInit() {
    console.log('ngOnInit');
    this.profileService.getMe()
      .subscribe(value => {
        console.log(value)
    })
  }
}
