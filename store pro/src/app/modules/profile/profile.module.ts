import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { OrdersComponent, ProfileComponent } from "./components";

@NgModule({
    declarations: [ProfileComponent, OrdersComponent],
    imports: [CommonModule, ProfileRoutingModule],
})
export class ProfileModule {}
