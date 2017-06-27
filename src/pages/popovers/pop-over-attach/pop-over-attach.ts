import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureAudioOptions} from '@ionic-native/media-capture';


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
        private mediaCapture: MediaCapture
        ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopOverAttachPage');
    }

    close() {
        console.log("closed");
    }

    capturePhoto() {
        let options: CaptureImageOptions = {limit: 1};
        //        let options: CaptureAudioOptions = {limit: 1};
        this.mediaCapture.captureImage(options)
            .then(
            (data: MediaFile[]) => console.log(data),
            (err: CaptureError) => console.error(err)
            );
    }
}
