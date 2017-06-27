import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureAudioOptions} from '@ionic-native/media-capture';
import {PopoverController} from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {

    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        private mediaCapture: MediaCapture,
        public popoverCtrl: PopoverController
        ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChatPage');
    }

    test(){
        console.log("fujnziona0");
    }
    
    recordingAudio(){
        let options: CaptureAudioOptions = {limit: 1};
        //        let options: CaptureAudioOptions = {limit: 1};
        this.mediaCapture.captureAudio(options)
            .then(
            (data: MediaFile[]) => console.log(data),
            (err: CaptureError) => console.error(err)
            );
    }
    
    
    presentPopoverAttach($event: any) {
        let popover = this.popoverCtrl.create('PopOverAttachPage');
        popover.present({
            ev: $event
        });
    }
    
    presentPopoverMore($event: any) {
        let popover = this.popoverCtrl.create('PopOverHomePage');
        popover.present({
            ev: $event
        });
    }

}
