import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RCDModule } from './RCD/RCD.module';

const routes: Routes = [
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes),  RCDModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
