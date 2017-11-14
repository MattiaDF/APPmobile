import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ValidationPage} from './validation';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {AuthProvider} from '../../providers/auth/auth'




@NgModule({
    declarations: [
        ValidationPage,
    ],
    imports: [
        IonicPageModule.forChild(ValidationPage),
    ],
    exports: [
        ValidationPage
    ],
    providers: [
        AuthProvider,
        AndroidPermissions
    ]
})
export class ValidationPageModule {}
