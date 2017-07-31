import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverAttachPage } from './pop-over-attach';


@NgModule({
  declarations: [
    PopOverAttachPage,
  ],
  imports: [
    IonicPageModule.forChild(PopOverAttachPage),
  ],
  exports: [
    PopOverAttachPage
  ],
  providers: [
  ]
})
export class PopOverAttachPageModule {}
