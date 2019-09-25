import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreaGruppoPage } from './crea-gruppo';


@NgModule({
  declarations: [
    CreaGruppoPage,
  ],
  imports: [
    IonicPageModule.forChild(CreaGruppoPage),
  ],
  exports: [
    CreaGruppoPage
  ]
})
export class CreaGruppoPageModule {}
