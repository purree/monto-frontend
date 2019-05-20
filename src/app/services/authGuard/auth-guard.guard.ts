import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(private router: Router, 
    private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

      console.log(route);

      if (!this.auth.user) {
          this.router.navigate(['login']);
          return false;
      }

      return true;

  }

}
