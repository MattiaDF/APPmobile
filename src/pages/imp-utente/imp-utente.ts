import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';

/**
 * Generated class for the ImpUtentePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-imp-utente',
    templateUrl: 'imp-utente.html',
})
export class ImpUtentePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ImpUtentePage');
    }
    editName() {
        this.alertCtrl.create({
            title: "Modifica nome utente",
            inputs: [{
                name: "name",
                type: "text"
            }],
            buttons: [{
                text: "Annulla",
                role: "cancel"
            }, {
                text: "Salva",
                handler: (data) => {
                    const name = data.name;
                    console.log("name: " + name);
                }
            }]
        }).present();
    }
}
