import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApoderadoPage } from './apoderado.page';

const routes: Routes = [
  {
    path: '',
    component: ApoderadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApoderadoPageRoutingModule {}
