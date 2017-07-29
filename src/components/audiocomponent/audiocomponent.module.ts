import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudiocomponentComponent } from './audiocomponent';

@NgModule({
  declarations: [
    AudiocomponentComponent,
  ],
  imports: [
    IonicPageModule.forChild(AudiocomponentComponent),
  ],
  exports: [
    AudiocomponentComponent
  ]
})
export class AudiocomponentComponentModule {}
