import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersComponent, ProfileComponent } from "./components";

const routes: Routes = [
    { path: "", component: ProfileComponent },
    { path: "orders", component: OrdersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {}
