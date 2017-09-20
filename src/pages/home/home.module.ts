import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {File} from '@ionic-native/file';
import { Contacts } from '@ionic-native/contacts';
@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ],
  providers:[
      File,
      Contacts
  ]
})
export class HomePageModule {}
