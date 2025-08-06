import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalLocksRoutingModule } from './digital-locks-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DigitalLocksRoutingModule,
    NgSelectModule
  ]
})
export class DigitalLocksModule { }
