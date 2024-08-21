import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () =>
        import('./components/grid/grid.component').then(m => m.GridComponent)
    ,
}];
