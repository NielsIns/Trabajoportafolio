import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'administrador',
        loadChildren: () => import('../administrador/administrador.module').then( m => m.AdministradorPageModule),
      },
      {
        path: 'perfil/:id',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'directivo',
        loadChildren: () => import('../directivo/directivo.module').then( m => m.DirectivoPageModule)
      },
      {
        path: 'colegio',
        loadChildren: () => import('../colegio/colegio.module').then( m => m.ColegioPageModule)
      },
      {
        path: 'apoderado/:id',
        loadChildren: () => import('../apoderado/apoderado.module').then( m => m.ApoderadoPageModule)
      },
      {
        path: 'preguntas-frecuentes',
        loadChildren: () => import('../preguntas-frecuentes/preguntas-frecuentes.module').then( m => m.PreguntasFrecuentesPageModule)
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
