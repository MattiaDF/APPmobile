import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServerAddressPage } from './server-address';

@NgModule({
  declarations: [
    ServerAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ServerAddressPage),
  ],
  exports: [
    ServerAddressPage
  ]
})
export class ServerAddressPageModule {}
