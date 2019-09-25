import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InfoGruppoPage} from './info-gruppo';
import {PhotoViewer} from '@ionic-native/photo-viewer';

@NgModule({
    declarations: [
        InfoGruppoPage,
    ],
    imports: [
        IonicPageModule.forChild(InfoGruppoPage),
    ],
    exports: [
        InfoGruppoPage
    ],
    providers: [
        PhotoViewer,
    ]
})
export class InfoGruppoPageModule {}
