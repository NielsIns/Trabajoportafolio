import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatriculaPage } from './matricula.page';

const routes: Routes = [
  {
    path: '',
    component: MatriculaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatriculaPageRoutingModule {}
