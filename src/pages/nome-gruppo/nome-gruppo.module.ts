import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NomeGruppoPage } from './nome-gruppo';

@NgModule({
  declarations: [
    NomeGruppoPage,
  ],
  imports: [
    IonicPageModule.forChild(NomeGruppoPage),
  ],
  exports: [
    NomeGruppoPage
  ]
})
export class NomeGruppoPageModule {}
