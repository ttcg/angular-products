import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private oauthService: OAuthService) {
  }
  
  public logout() {
    this.oauthService.logOut();
  }  

  public get userName() {

    var claims = this.oauthService.getIdentityClaims();

    if (!claims) return null;

    return claims['given_name'];
  }
}
