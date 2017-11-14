import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from './home';
import {File} from '@ionic-native/file';
import {Contacts} from '@ionic-native/contacts';
import {WebSocketProvider} from '../../providers/web-socket/web-socket';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ],
    providers: [
        File,
        Contacts,
        WebSocketProvider
    ]
})
export class HomePageModule {}
