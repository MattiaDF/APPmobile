import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';
import {AudioProvider} from '../providers/audio/audio';
import {File} from '@ionic-native/file';
import {MediaPlugin, MediaObject} from '@ionic-native/media';
import {FilePath} from '@ionic-native/file-path';
import {AudiocomponentComponent} from '../components/audiocomponent/audiocomponent';
import {UserProvider} from '../providers/user/user';
import {DbProvider} from '../providers/db/db';
import {SQLite} from '@ionic-native/sqlite';
import { AuthProvider } from '../providers/auth/auth';
import { CommonProvider } from '../providers/common/common';

@NgModule({
    declarations: [
        MyApp,
        //    AudiocomponentComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicStorageModule.forRoot({
            name: '__quickchat_configuration',
             driverOrder: ['websql', 'sqlite']
        }),
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AudioProvider,
        MediaPlugin,
        File,
        FilePath,
        UserProvider,
        DbProvider,
        SQLite,
    AuthProvider,
    CommonProvider
    ]
})
export class AppModule {}
