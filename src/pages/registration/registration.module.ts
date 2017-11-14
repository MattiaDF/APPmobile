import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RegistrationPage} from './registration';
import {AuthProvider} from '../../providers/auth/auth';
import {File} from '@ionic-native/file';


@NgModule({
    declarations: [
        RegistrationPage,
    ],
    imports: [
        IonicPageModule.forChild(RegistrationPage),
    ],
    exports: [
        RegistrationPage
    ],
    providers: [
        AuthProvider
        ,File
    ]
})
export class RegistrationPageModule {}
