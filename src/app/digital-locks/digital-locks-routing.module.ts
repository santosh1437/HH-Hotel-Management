import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevicesComponent } from './devices/devices.component';
import { PropertiesComponent } from './properties/properties.component';
import { BookingsComponent } from './bookings/bookings.component';
import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
  {
    path:'devices',
    component: DevicesComponent
  },
  {
    path:'properties',
    component: PropertiesComponent
  },
  {
    path:'bookings',
    component:BookingsComponent
  },
  {
    path:'staff',
    component:StaffComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalLocksRoutingModule { }
