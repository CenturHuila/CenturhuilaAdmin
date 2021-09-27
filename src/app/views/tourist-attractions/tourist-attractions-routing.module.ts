import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TouristAttractionsComponent } from './tourist-attractions.component';

const routes: Routes = [
  {
    path: '',
    component: TouristAttractionsComponent,
    data: {
      title: 'Atractivos turísticos'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TouristAttractionsRoutingModule {}
