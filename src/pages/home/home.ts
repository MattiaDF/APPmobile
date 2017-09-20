import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {File} from '@ionic-native/file';
import {DbProvider} from '../../providers/db/db'
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import {UserProvider} from "../../providers/user/user";

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
        private contacts: Contacts,
        private _db: DbProvider,
        private sUser: UserProvider) {
//        this.file.createDir(this.file.externalDataDirectory, "QuickChat",true).then((result) => {
//        this.file.createDir("file:///storage/emulated/0", "QuickChat",true).then((result) => {
//            console.log(result);
//            console.log("creata: " + this.file.dataDirectory);
//        
        this.sUser.get().then( user => {
                        console.log(user, 'home');
                        this._db.addUser(user);
                    })
                    
                    this._db.getAllUsers();
 this.contacts.find([ 'displayName', 'name' ],{}).then((contacts) => {
     console.log(contacts);
        }, (error) => {
          console.log(error);
        });
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
