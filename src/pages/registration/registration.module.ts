import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RegistrationPage} from './registration';
import {AuthProvider} from '../../providers/auth/auth';

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
    ]
})
export class RegistrationPageModule {}
