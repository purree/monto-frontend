import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private auth: AuthService,
    private storage: Storage) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.user && !this.checkStorageForUser()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  async checkStorageForUser() {
    await this.storage.get('user').then(user => this.auth.user = user);
    console.log(this.auth.user);
    return (this.auth.user);
  }

}
