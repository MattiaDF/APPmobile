import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ImpUtentePage} from './imp-utente';
import {Camera} from '@ionic-native/camera';


@NgModule({
    declarations: [
        ImpUtentePage,
    ],
    imports: [
        IonicPageModule.forChild(ImpUtentePage),
    ],
    exports: [
        ImpUtentePage
    ],
    providers: [
        Camera
    ]
})
export class ImpUtentePageModule {}
