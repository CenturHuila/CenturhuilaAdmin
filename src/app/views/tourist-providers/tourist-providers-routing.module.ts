import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TouristProvidersComponent } from './tourist-providers.component';

const routes: Routes = [
  {
    path: '',
    component: TouristProvidersComponent,
    data: {
      title: 'Prestadores Turísticos'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TouristProvidersRoutingModule {}
