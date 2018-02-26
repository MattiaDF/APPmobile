import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {PhotoViewer} from '@ionic-native/photo-viewer';

import {ChatRoom} from '../../models/chat';
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

    public chat: ChatRoom;
    public media: Array<string> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public alertCtrl: AlertController, public modalCtrl: ModalController,
        private photoViewer: PhotoViewer,
    ) {
        this.chat = this.navParams.get('chat');

        for (let m of this.chat.messages) {
            console.log(m);
            if (m.type == 1) {
                this.media.push(m.media);
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InfoGruppoPage');
    }

    edit() {
        this.modalCtrl.create("EditChatroomPage", {'chat': this.chat}).present();
    }

    navToInfoContatto(user) {
        this.navCtrl.push("InfoContattoPage", {'user': user, 'media': this.media});
    }
    
    allMedia() {
        this.navCtrl.push("MediaPage", {'messages': this.chat.messages});
    }

    viewPhoto(photo) {
        this.photoViewer.show(photo, '', {share: false});
    }

}
