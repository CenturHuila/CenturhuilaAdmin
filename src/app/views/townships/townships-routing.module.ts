import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TownshipsComponent } from './townships.component';

const routes: Routes = [
  {
    path: '',
    component: TownshipsComponent,
    data: {
      title: 'Municipios'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TownshipsRoutingModule {}
