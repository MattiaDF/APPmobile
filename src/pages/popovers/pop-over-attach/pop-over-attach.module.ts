import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverAttachPage } from './pop-over-attach';
import {MediaCapture} from '@ionic-native/media-capture';


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
      MediaCapture
  ]
})
export class PopOverAttachPageModule {}
