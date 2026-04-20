import { Component } from "@angular/core";
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
} from "@angular/router";
import { filter, map, startWith } from "rxjs";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    readonly isNavigating$ = this.router.events.pipe(
        filter(
            (event) =>
                event instanceof NavigationStart ||
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError,
        ),
        map((event) => event instanceof NavigationStart),
        startWith(false),
    );

    constructor(private router: Router) {}
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
