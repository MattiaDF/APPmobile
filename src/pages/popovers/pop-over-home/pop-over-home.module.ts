import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverHomePage } from './pop-over-home';

@NgModule({
  declarations: [
    PopOverHomePage,
  ],
  imports: [
    IonicPageModule.forChild(PopOverHomePage),
  ],
  exports: [
    PopOverHomePage
  ]
})
export class PopOverHomePageModule {}
