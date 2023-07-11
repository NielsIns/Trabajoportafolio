import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { OracleService } from './oracle.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor( private router: Router, private oracleService: OracleService){

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //LOGICA
    var isAuth: any = this.oracleService.getAuth();
    console.log(isAuth);
    
    if (!isAuth) {
      this.router.navigate(['/login']);
      return false; // Agrega este retorno
    } else {
      return true;
    }
  }
  
  
      
      
      
      
      
      
  

  
}
