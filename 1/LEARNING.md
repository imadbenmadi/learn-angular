# Angular 15 Learning Guide (Store V2 + Store V3)

This repo is intentionally written so you can learn Angular **by reading the code**.

- **Store V2** = fundamentals (components, templates, routing basics, services, RxJS, forms, directives/pipes)
- **Store V3** = the “rest” (lazy modules, resolver, canDeactivate guard, typed reactive forms, custom form control, standalone route, HTTP testing)

## How to run

From this folder (`learn-angular/1`):

```bash
npm install
npm start
```

Open the app and use the top links:

- **Store V2**: `/store-v2`
- **Store V3**: `/store-v3`

## Read order (recommended)

### 0) Angular app entry points

1. `src/main.ts`
    - Bootstraps the Angular app.
2. `src/app/app.module.ts`
    - The “root module” (NgModule) version of Angular.
    - Declares components, imports Angular modules, configures routing.
3. `src/app/app.component.html`
    - Very small shell: `top-bar` + `<router-outlet>`

### 1) Store V2 (fundamentals)

Store V2 is a guided learning area with a shell + nested routes.

Start here:

1. `src/app/store-v2/store-v2-shell/store-v2-shell.component.html`
    - How to build a _feature shell_.
    - Child navigation + nested `<router-outlet>`.
2. `src/app/app.module.ts` (the `store-v2` route)
    - Child routes configuration (`children: [...]`).
    - A `canActivate` guard.

Then core topics:

- **RxJS + state in a component**
    - `src/app/store-v2/catalog/catalog.component.ts`
    - Shows `BehaviorSubject`, `combineLatest`, `map`.

- **Service + HTTP + caching**
    - `src/app/store-v2/services/store-v2.service.ts`
    - Shows `HttpClient`, `catchError`, `shareReplay`.

- **Reactive forms**
    - `src/app/store-v2/cart-v2/cart-v2.component.ts`
    - Shows `FormBuilder`, `Validators`, `markAllAsTouched()`.

- **Template-driven forms / template syntax playground**
    - `src/app/store-v2/learning-playground/*`

- **Custom pipe + directive**
    - `src/app/store-v2/shared/stock-level.pipe.ts`
    - `src/app/store-v2/shared/spotlight.directive.ts`

- **Guard**
    - `src/app/store-v2/guards/store-v2-enter.guard.ts`
    - Shows a simple `CanActivate` guard.

What you should be comfortable with after Store V2:

- components + templates
- `@Input()` / `@Output()` patterns (see Store V1 components too)
- routing basics
- DI + services
- RxJS streams and `async` pipe
- reactive + template-driven forms

### 2) Store V3 (advanced Angular 15 patterns)

Store V3 is in a separate folder and is wired as a **lazy-loaded** feature.

Start here:

1. `src/app/app.module.ts` (the `store-v3` route)
    - Uses `loadChildren` to lazy-load a feature module.
2. `src/app/store-v3/store-v3.module.ts`
    - Feature module declares feature components.
3. `src/app/store-v3/store-v3-routing.module.ts`
    - Feature routing with:
        - `resolve` (resolver)
        - `canDeactivate` (unsaved changes guard)
        - `loadComponent` (standalone component route)

#### A) OnPush + facade (simple state management)

- `src/app/store-v3/overview/store-v3-overview.component.ts`
    - Uses `ChangeDetectionStrategy.OnPush`.
    - Uses a facade service for state.
- `src/app/store-v3/state/store-v3-facade.service.ts`
    - Stores UI state with `BehaviorSubject`.
    - Builds derived view-model stream with `combineLatest`.

Key idea:

- Components become mostly “wiring”: inputs update the facade, template uses `async`.

#### B) Resolver (data before route activates)

- `src/app/store-v3/resolvers/store-v3-product.resolver.ts`
    - Reads `:id` route param.
    - Returns an Observable of a product.
- `src/app/store-v3/product-details/store-v3-product-details.component.ts`
    - Reads resolved data via `ActivatedRoute.data`.

Key idea:

- Resolver lets the page render with data already available.

#### C) Typed reactive forms + custom validators

- `src/app/store-v3/forms/store-v3-typed-forms.component.ts`
    - Uses **typed** `FormGroup` / `FormControl`.
    - Uses built-in validators (`required`, `email`, etc.).
- `src/app/store-v3/forms/validators/coupon-code.validator.ts`
    - Shows how to write a custom `ValidatorFn`.

Key idea:

- Typed forms reduce runtime bugs by making form values type-safe.

#### D) Custom form control (ControlValueAccessor)

- `src/app/store-v3/forms/stars-rating-control/stars-rating-control.component.ts`
    - Implements `ControlValueAccessor`.
    - Works with `formControlName="rating"`.

Key idea:

- ControlValueAccessor is how you build “real” reusable form components.

#### E) CanDeactivate guard (unsaved changes)

- `src/app/store-v3/guards/pending-changes.guard.ts`
    - Uses a `HasPendingChanges` interface.
- `src/app/store-v3/forms/store-v3-typed-forms.component.ts`
    - Implements `hasPendingChanges()`.

Key idea:

- Guard prevents losing work when navigating away.

#### F) Standalone component route (Angular 15 feature)

- `src/app/store-v3/standalone/standalone-demo.component.ts`
    - `standalone: true`
    - Uses `inject()` for DI
- `src/app/store-v3/store-v3-routing.module.ts`
    - Uses `loadComponent` to lazy load the standalone route

Key idea:

- You can use standalone components even in a module-based app.

#### G) HTTP + InjectionToken + testing HttpClient

- `src/app/store-v3/tokens/store-v3.tokens.ts`
    - Defines an `InjectionToken`.
- `src/app/app.module.ts`
    - Provides the token value (the products JSON URL).
- `src/app/store-v3/services/store-v3-products.service.ts`
    - Uses `HttpClient` + caching (`shareReplay`).
- `src/app/store-v3/services/store-v3-products.service.spec.ts`
    - Uses `HttpClientTestingModule` + `HttpTestingController`.

Key idea:

- InjectionToken keeps configuration values type-safe.
- HttpClientTestingModule lets you unit-test HTTP without real network calls.

## Exercises (good for learning)

- Add a new route under Store V3 called `admin` and lazy-load a **standalone** component.
- Extend `couponCodeValidator` to accept `WELCOME-2026` too.
- Update the `PendingChangesGuard` to skip confirmation after successful submit.
- Add one more unit test that verifies HTTP errors return `[]`.

## What this repo does NOT try to teach

Angular is huge. These topics are intentionally out-of-scope here:

- Angular Universal (SSR)
- Full state management frameworks (NgRx)
- i18n at scale
- Micro-frontends

If you want, tell me which of these you care about and I can create a separate learning area for one of them.
