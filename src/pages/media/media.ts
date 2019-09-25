import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media';


import {Message} from '../../models/message';

/**
 * Generated class for the MediaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-media',
    templateUrl: 'media.html',
})
export class MediaPage {
    mediaType: string = "foto";
    public media_foto: Array<Message> = [];
    public media_video: Array<Message> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private photoViewer: PhotoViewer,
        private streamingMedia: StreamingMedia,
        public _DomSanitizer: DomSanitizer, ) {
        let messages = this.navParams.get('messages');

        for (let m of messages) {
            console.log(m);
            if (m.type == 1) {
                this.media_foto.push(m);
            }
            if (m.type == 2) {
                this.media_video.push(m);
            }
        }
    }

    playVideo(message: Message) {
        console.log('video play', message.media);

        let options: StreamingVideoOptions = {
            successCallback: () => {console.log('Video played')},
            errorCallback: (e) => {console.log('Error streaming')},
            orientation: 'portrait'
        };

        this.streamingMedia.playVideo(message.media, options);
    }

    viewPhoto(photo) {
        this.photoViewer.show(photo, '', {share: false});
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MediaPage');
    }

}
