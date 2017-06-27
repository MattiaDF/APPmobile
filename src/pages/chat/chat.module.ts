import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { ElasticModule } from 'angular2-elastic';
import {MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureAudioOptions} from '@ionic-native/media-capture';


@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    ElasticModule
  ],
  exports: [
    ChatPage
  ],
  providers: [
      MediaCapture
  ]
})
export class ChatPageModule {}
