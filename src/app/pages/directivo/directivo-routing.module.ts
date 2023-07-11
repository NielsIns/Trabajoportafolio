import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectivoPage } from './directivo.page';

const routes: Routes = [
  {
    path: '',
    component: DirectivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectivoPageRoutingModule {}
