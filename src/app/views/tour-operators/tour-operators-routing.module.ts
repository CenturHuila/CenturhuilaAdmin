import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TourOperatorsComponent } from './tour-operators.component';

const routes: Routes = [
  {
    path: '',
    component: TourOperatorsComponent,
    data: {
      title: 'Agencias de viajes'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourOperatorsRoutingModule {}
