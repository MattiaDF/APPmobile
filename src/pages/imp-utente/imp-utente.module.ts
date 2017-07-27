import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImpUtentePage } from './imp-utente';

@NgModule({
  declarations: [
    ImpUtentePage,
  ],
  imports: [
    IonicPageModule.forChild(ImpUtentePage),
  ],
  exports: [
    ImpUtentePage
  ]
})
export class ImpUtentePageModule {}
