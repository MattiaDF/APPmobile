import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';

/**
 * Generated class for the InfoGruppoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-info-gruppo',
    templateUrl: 'info-gruppo.html',
})
export class InfoGruppoPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InfoGruppoPage');
    }

    navToInfoContatto() {
        this.navCtrl.push("InfoContattoPage");
    }

    editName() {
        this.alertCtrl.create({
            title: "Modifica nome gruppo",
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
