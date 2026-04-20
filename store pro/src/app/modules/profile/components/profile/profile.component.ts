import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../../../../services/auth.service";
import { User } from "../../../../models";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
    user$: Observable<User | null>;

    constructor(private authService: AuthService) {
        this.user$ = this.authService.currentUser$;
    }

    logout(): void {
        this.authService.logout();
    }
}
