import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OAuthConfig } from './oauth/oauthConfig';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { ToastsComponent } from './toasts/toasts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-products';

  constructor(private oauthService: OAuthService, private router: Router) {
    this.ConfigureOauth();
  }

  private ConfigureOauth() {
    this.oauthService.configure(OAuthConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.events
      .pipe(filter((e) => ["token_received"].includes(e.type)))
      .subscribe((e) => this.oauthService.loadUserProfile());
  }
}
