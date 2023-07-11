import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColegioPage } from './colegio.page';

const routes: Routes = [
  {
    path: '',
    component: ColegioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColegioPageRoutingModule {}
