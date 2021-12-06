import { Component, Directive } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = environment.title;
  favIcon: HTMLLinkElement = document.querySelector('#favIconId');
  showNavbar = true;
  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle(environment.title);
    this.favIcon.href = environment.logourl;

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      console.log(event);
      let evnt = JSON.parse(JSON.stringify(event));
      let url: string = evnt.url;
      console.log(url);
      if (url.startsWith('/login')) {
        this.showNavbar = false;
      }
    });
  }
}
