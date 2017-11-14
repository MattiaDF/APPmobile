import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';


/**
 * Generated class for the PopOverAttachPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-pop-over-attach',
    templateUrl: 'pop-over-attach.html',
})
export class PopOverAttachPage {
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopOverAttachPage');
    }

    close(name) {
        this.viewCtrl.dismiss(name);
        console.log("closed");
    }
    

}
