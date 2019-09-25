import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import {MyApp} from './app.component';
import {Contacts} from '@ionic-native/contacts';
import {SQLite} from '@ionic-native/sqlite';
import {FileTransfer} from '@ionic-native/file-transfer';
import {Vibration} from '@ionic-native/vibration';
import {File} from '@ionic-native/file';
import {Badge} from '@ionic-native/badge';

//import {MediaPlugin} from '@ionic-native/media';

//my providers
import {UserProvider} from '../providers/user/user';
import {StorageProvider} from '../providers/storage/storage';
import {DbProvider} from '../providers/db/db';
//import {AuthProvider} from '../providers/auth/auth';
import {ContactProvider} from '../providers/contact/contact';
import {WebSocketProvider} from '../providers/web-socket/web-socket';
import {ChatProvider} from "../providers/chat/chat";
import {MediaProvider} from '../providers/media/media';



@NgModule({
    declarations: [
        MyApp,
        //    AudiocomponentComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: '__quickchat_configuration',
            driverOrder: ['websql', 'sqlite']
        }),

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        SQLite,
        Vibration,
        FileTransfer,
        Contacts,
        File,
        Badge,
        //        MediaPlugin,
        StorageProvider,
        DbProvider,
        UserProvider,
        //        AuthProvider,
        ContactProvider,
        ChatProvider,
        WebSocketProvider,
        MediaProvider,
    ]
})
export class AppModule {}
