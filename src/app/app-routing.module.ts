import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/service/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'admin/account',
    loadChildren: () => import('./pages/admin/account/account.module').then( m => m.AccountPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
