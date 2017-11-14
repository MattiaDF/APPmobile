import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, App, ViewController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';

//my models
import {ChatRoom} from '../../models/chat';

//my providers
import {ChatProvider} from '../../providers/chat/chat'

@IonicPage()
@Component({
    selector: 'page-edit-chatroom',
    templateUrl: 'edit-chatroom.html',
})
export class EditChatroomPage {

    public chat: ChatRoom;
    public name: string;
    public image_url;

    constructor(public navCtrl: NavController, public appCtrl: App, public navParams: NavParams, private camera: Camera, public viewCtrl: ViewController,
        public sChat: ChatProvider) {
        this.chat = this.navParams.get('chat');
        this.image_url = this.chat.avatar.src;
        this.name = this.chat.name;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NomeGruppoPage');
    }

    save() {
        console.log('nome modificato', this.chat.name, 'immagine caricata', this.image_url)
        
        this.chat.name = this.name;
        this.sChat.updateChatRoom(this.chat, this.image_url).then((updatedChat) => {
            this.navCtrl.push("ChatPage", {'chat': updatedChat}).then(() => {
                this.dismiss();
            })
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




