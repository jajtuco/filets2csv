import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadComponent } from './components/upload/upload.component';


const routes: Routes = [
    { path: 'upload', component: UploadComponent},
    { path: '**', pathMatch:'full', redirectTo:'upload'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
