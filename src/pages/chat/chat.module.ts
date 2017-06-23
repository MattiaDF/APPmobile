import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { ElasticModule } from 'angular2-elastic';

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
  ]
})
export class ChatPageModule {}
