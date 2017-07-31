import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { ElasticModule } from 'angular2-elastic';
import { Camera } from '@ionic-native/camera';
import {File} from '@ionic-native/file';
import {MediaPlugin, MediaObject} from '@ionic-native/media';
import { FilePath } from '@ionic-native/file-path';
import {AudiocomponentComponent} from '../../components/audiocomponent/audiocomponent';

@NgModule({
  declarations: [
    ChatPage,
    AudiocomponentComponent
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    ElasticModule,
    
  ],
  exports: [
    ChatPage
  ],
  providers: [
      Camera,
      MediaPlugin,
      File,
      FilePath,
  ]
})
export class ChatPageModule {}
