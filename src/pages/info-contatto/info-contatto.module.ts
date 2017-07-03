import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoContattoPage } from './info-contatto';

@NgModule({
  declarations: [
    InfoContattoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoContattoPage),
  ],
  exports: [
    InfoContattoPage
  ]
})
export class InfoContattoPageModule {}
