import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';

//my providers
import {ContactProvider} from "../../providers/contact/contact";
import {UserProvider} from "../../providers/user/user";

//my models
import {User} from "../../models/user";



/**
 * Generated class for the CreaGruppoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-crea-gruppo',
    templateUrl: 'crea-gruppo.html',
})
export class CreaGruppoPage {


    public contacts: Array<any> = [];
    public resultSearch: Array<any> = [];
    public inputValue: string = '';

    constructor(public navCtrl: NavController, public navParams: NavParams, private sContact: ContactProvider, 
        public viewCtrl: ViewController, public modalCtrl: ModalController, private sUser: UserProvider) {
        console.log('lista contatti in crea chat di gruppo', this.sContact.contactsList)
        for (let contact of this.sContact.contactsList) {
            this.contacts.push({user: contact, selected: false});
            this.resultSearch = this.contacts;
        }


    }

    onInput(event) {
        console.log(this.inputValue, 'input');
        if (this.inputValue === '') {
            this.resultSearch = this.contacts;
            return;
        } else {
            this.resultSearch = [];
        }
        let u: any;
        for (u of this.contacts) {
            if (u.user.name.indexOf(this.inputValue) >= 0) {
                this.resultSearch.push(u);
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreaGruppoPage');
    }

    toggleUser(user) {

        console.log(user, 'toogle')
        for (let u of this.contacts) {
            if (u.user.id == user.id) {
                u.selected = !u.selected;
                console.log(u, 'contacts trovato')
            }
        }

        //        for (let rs of this.resultSearch) {
        //            if (rs.user.id == user.id) {
        //                rs.selected = !rs.selected;
        //                console.log(rs, 'resultSearch trovato')
        //            }
        //        }
    }


    navToNomeGruppoPage() {
        let partecipants: Array<User> = [];
        for (let contact of this.contacts) {
            if (contact.selected) {
                partecipants.push(contact.user);
            }
        }
        partecipants.push(this.sUser.get());
        console.log('crea gruppo selected user', partecipants, this.contacts)
        let modal = this.modalCtrl.create("NomeGruppoPage", {'participants': partecipants})
        modal.present();
        modal.onDidDismiss(() => {
            this.dismiss()
        })
        //        this.navCtrl.push("NomeGruppoPage", {'participants': partecipants});
    }

    dismiss() {
        console.log("dismiss crea gruppo")
        this.viewCtrl.dismiss();
    }

}
