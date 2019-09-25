import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, App, ViewController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';

import {User} from '../../models/user';

import {ChatProvider} from '../../providers/chat/chat'


/**
 * Generated class for the NomeGruppoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-nome-gruppo',
    templateUrl: 'nome-gruppo.html',
})
export class NomeGruppoPage {

    public image_url: string = 'assets/img/default.png';
    public chat_name: string = 'Nome';
    public contacts: Array<User> = [];

    constructor(public navCtrl: NavController, public appCtrl: App, public navParams: NavParams, private camera: Camera, public viewCtrl: ViewController,
        public sChat: ChatProvider) {
        console.log('pariticpants nome gruppo', this.navParams.get('participants'));
        this.contacts = this.navParams.get('participants');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NomeGruppoPage');
    }

    createChat() {
        console.log('create chat in nome gruppo contati', this.contacts)
        
        this.sChat.newChatroom(this.chat_name, this.image_url, this.contacts).then((savedChat) => {
            this.sChat.chats.push(savedChat);
            //            this.viewCtrl.dismiss();
            this.navCtrl.push("ChatPage", {'chat': savedChat}).then(() => {
                this.dismiss();
            })
        }).catch((error) => {
            console.log(error, 'errore in nome gruppo creaziuone chat')
        })
    }


    uploadPhoto() {
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            //            saveToPhotoAlbum: true,
            correctOrientation: true,
            allowEdit: true,
        }

        this.camera.getPicture(options).then((imageData) => {

            console.log(imageData, 'imageDAta');
            this.image_url = imageData;
        }, (err) => {
            // Handle error
        });


    }

    dismiss() {
        console.log("dismiss nome gruppo")
        this.viewCtrl.dismiss();
    }

}




