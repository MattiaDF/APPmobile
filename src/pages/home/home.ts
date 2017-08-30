import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {File} from '@ionic-native/file';
import {DbProvider} from '../../providers/db/db'

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        public popoverCtrl: PopoverController, 
        private file: File,
        _db: DbProvider) {
//        this.file.createDir(this.file.externalDataDirectory, "QuickChat",true).then((result) => {
//        this.file.createDir("file:///storage/emulated/0", "QuickChat",true).then((result) => {
//            console.log(result);
//            console.log("creata: " + this.file.dataDirectory);
//        
//        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
    }

    presentPopover($event: any) {
        let popover = this.popoverCtrl.create('PopOverHomePage');
        popover.present({
            ev: $event
        });
    }
    
    toChat() {
        this.navCtrl.push("ChatPage");
    }
}
