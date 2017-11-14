import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PhotoViewer} from '@ionic-native/photo-viewer';

import {User} from '../../models/user'

/**
 * Generated class for the InfoContattoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-info-contatto',
    templateUrl: 'info-contatto.html',
})
export class InfoContattoPage {

    public user: User;
    public media: Array<string>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private photoViewer: PhotoViewer,
    ) {
        this.user = this.navParams.get('user');
        this.media = this.navParams.get("media");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InfoContattoPage');
    }

    viewPhoto(photo) {
        this.photoViewer.show(photo, '', {share: false});
    }

}
