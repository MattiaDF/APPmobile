import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content} from 'ionic-angular';
import {PopoverController} from 'ionic-angular';
//import {MediaPlugin, MediaObject} from '@ionic-native/media';
//import {File} from '@ionic-native/file';

//Models
import {Message} from '../../models/message.model';

//Providers
import {AudioProvider} from '../../providers/audio/audio';


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

    messages: Array<Message> = [];
    message: String = "";
//    audio: MediaObject = null;
//    private tmp_voice: Voice;

    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private sAudio: AudioProvider,
//        private media: MediaPlugin,
//        private file: File,
    ) {
        let mm = {'id': 1, 'sender': 'Mario Mennella', 'body': 'ciaiicaiciachaich cihiachaichi hcaihaichai', 'type': 'text', 'created_at': '3:45 PM'};
        for (let i = 0, max = 10; i < max; i++) {
            this.messages.push(new Message(mm));
        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChatPage');
    }


    recordigStart() {
        console.log("recording start");
//        this.tmp_voice = new Voice();
//        this.tmp_voice.nameFile = 'prova.mp3';
//        this.tmp_voice.seek = 0;
        this.sAudio.recordigStart('prova.mp3');
    }

    recordigEnd() {
//        console.log("recording end");
//        this.audio.stopRecord();
//        this.tmp_voice.duration = this.sAudio.recordigEnd();
        let audioM = new Message();
        audioM.id = 11;
        audioM.sender = "Mennella Mario";
        audioM.type = "audio";
        audioM.created_at = "12:45 PM";
//        audioM.media = this.tmp_voice;
        this.messages.push(audioM);
    }

    play(message: Message) {
//        console.log(message);
////        this.audio.play();
//        this.sAudio.play(message.media);
//        while (message.media.seek <= 100){
//            console.log(message.media.seek);
//        }
    }

//    recordingAudio() {
//
//        console.log("sto registr        ando");
//        this.file.createFile("file:///storage/emulated/0/QuickChat", 'myfile.mp3', true).then((result: any) => {
//            console.log(this.file, result);
//            let file: MediaObject = this.media.create("file:///storage/emulated/0/QuickChat" + "/" + "myaudio.mp3");
//            console.log(file);
//            file.startRecord();
//            window.setTimeout(() => {
//                file.stopRecord();
//                console.log("finito");
//                file.play();
//            }
//                , 5000);
//        });
//
//    }





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

    navToInfoContatto() {
        this.navCtrl.push("InfoContattoPage");
    }


    send() {
        console.log(this.message);
        let mm = {'id': 1, 'sender': 'Mario Mennella', 'body': this.message, 'type': 'text', 'created_at': '3:45 PM'};
        this.messages.push(new Message(mm));
        this.message = "";
        window.setTimeout(() => {
            this.content.scrollToBottom();
        }
            , 300);
    }

    ionViewDidEnter() {
        this.content.scrollToBottom();
    }

}
