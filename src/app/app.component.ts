import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';
import {File} from '@ionic-native/file';

import {STORAGE_KEYS} from '../constants';

//import { HomePage } from '../pages/home/home';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {


    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, file: File) {
        platform.ready().then(() => {
            storage.get(STORAGE_KEYS.USER).then((user) => {
                if (user != null) {
                    this.rootPage = 'HomePage';
                } else {
                    console.log(file.dataDirectory, ' dataDirectory');
                    console.log(file.externalApplicationStorageDirectory, ' externalApplicationStorageDirectory ');
                    console.log(file.externalDataDirectory, ' externalDataDirectory');
                    console.log(file.externalRootDirectory, ' externalRootDirectory');
                    file.createDir("file:///storage/emulated/0/", "QuickChat", true).then(() => {
                        console.log("Dir QuickChat created")
                    }).catch((err) => {
                        console.log("error creation quickChat Dir", err)
                    })
                    this.rootPage = 'ServerAddressPage';
                }
            }).catch((err) => {
                this.rootPage = 'ServerAddressPage';

            })
            //            this.rootPage = 'InfoContactPage'
            //                        this.rootPage = 'ChatPage'

            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            //            platform.registerBackButtonAction(() => {
            //                if (nav.canGoBack()) {
            //                    nav.pop();
            //                }
            //            });
        });

    }
}

