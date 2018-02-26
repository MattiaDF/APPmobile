import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InfoContattoPage} from './info-contatto';
import {PhotoViewer} from '@ionic-native/photo-viewer';

@NgModule({
    declarations: [
        InfoContattoPage,
    ],
    imports: [
        IonicPageModule.forChild(InfoContattoPage),
    ],
    exports: [
        InfoContattoPage
    ],
    providers: [
        PhotoViewer
    ]
})
export class InfoContattoPageModule {}
