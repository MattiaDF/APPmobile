import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoGruppoPage } from './info-gruppo';

@NgModule({
  declarations: [
    InfoGruppoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoGruppoPage),
  ],
  exports: [
    InfoGruppoPage
  ]
})
export class InfoGruppoPageModule {}
