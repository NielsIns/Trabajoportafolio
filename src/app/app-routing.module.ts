import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    
    
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/administrador/administrador.module').then( m => m.AdministradorPageModule),
    
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    
    
  },
  {
    path: 'apoderado',
    loadChildren: () => import('./pages/apoderado/apoderado.module').then( m => m.ApoderadoPageModule),
    
  },
  {
    path: 'colegio',
    loadChildren: () => import('./pages/colegio/colegio.module').then( m => m.ColegioPageModule),
    
  },
  {
    path: 'directivo',
    loadChildren: () => import('./pages/directivo/directivo.module').then( m => m.DirectivoPageModule),
    
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'preguntas-frecuentes',
    loadChildren: () => import('./pages/preguntas-frecuentes/preguntas-frecuentes.module').then( m => m.PreguntasFrecuentesPageModule)
  },
  {
    path: 'matricula',
    loadChildren: () => import('./pages/matricula/matricula.module').then( m => m.MatriculaPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
