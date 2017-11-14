import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NomeGruppoPage} from './nome-gruppo';
import {Camera} from '@ionic-native/camera';

@NgModule({
    declarations: [
        NomeGruppoPage,
    ],
    imports: [
        IonicPageModule.forChild(NomeGruppoPage),
    ],
    exports: [
        NomeGruppoPage
    ],
    providers: [
        Camera
    ]
})
export class NomeGruppoPageModule {}
