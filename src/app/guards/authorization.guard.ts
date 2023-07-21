import {Injectable} from "@angular/core";
import {AppStateService} from "../services/app-state.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn:'root'
})
export class AuthorizationGuard {
  constructor(private appState: AppStateService, private router : Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree|boolean {
    if (this.appState.authState.roles.includes(route.data['requiredRoles'])){
      return true;
    }
    else {
      this.router.navigateByUrl("/admin/notAuthorized");
      return false;
    }
  }
}
