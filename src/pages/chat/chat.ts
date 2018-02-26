import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content} from 'ionic-angular';
import {PopoverController} from 'ionic-angular';
import {MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions} from '@ionic-native/media-capture';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {MediaPlugin, MediaObject} from '@ionic-native/media';
import {File} from '@ionic-native/file';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media';
import {Vibration} from '@ionic-native/vibration';
import {DomSanitizer} from '@angular/platform-browser';


//Models
import {Chat, SingleChat, ChatRoom} from '../../models/chat';
import {Message} from '../../models/message';

//Providers
import {UserProvider} from '../../providers/user/user';
import {ChatProvider} from '../../providers/chat/chat';
import {MediaProvider} from '../../providers/media/media'
import {WebSocketProvider} from '../../providers/web-socket/web-socket';


declare var navigator: any;
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

    chat: Chat = null;
    message: String = "";
    audio_name: string = ''
    base_url: string;
    count: number = 0;
    time_recording = '00:00';
    window: any;
    stopRecording: boolean = false;

    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private sUser: UserProvider,
        private sChat: ChatProvider,
        private mediaCapture: MediaCapture,
        private sMedia: MediaProvider,
        private camera: Camera,
        private photoViewer: PhotoViewer,
        private media: MediaPlugin,
        private file: File,
        private vibration: Vibration,
        private streamingMedia: StreamingMedia,
        public _DomSanitizer: DomSanitizer,
        //         private sWebSocket: WebSocketProvider
    ) {

        //        navigator.createThumbnail(this.file.externalApplicationStorageDirectory + '20171030_170402.mp4', function (err, imageData) {
        //            if (err)
        //                throw err;
        //
        //            console.log(imageData); // Will log the base64 encoded string in console. 
        //        });
        this.chat = navParams.get('chat');
        this.sMedia.inizializeChatFolder(this.chat.token).then(() => {
            this.base_url = this.file.externalApplicationStorageDirectory + 'media/' + this.chat.token + '/audio/';
        })

    }

    ionViewWillEnter() {
        this.sChat.events.subscribe(this.chat.token + ':message', () => {
            console.log('chat token:message events receveid in chat page');

            this.sChat.loadMessages(this.chat.token)
                .then(messages => {
                    console.log('then', messages);
                    this.chat.messages = messages;
                    console.log('this chat  messages', this.chat.messages);
                }).catch(err => {
                    console.log('è andato in catch', err);
                });
        });

    }

    viewPhoto(photo) {
        this.photoViewer.show(photo, '', {share: false});
    }

    ionViewWillUnload() {
        this.sChat.events.unsubscribe(this.chat.token + ':message', () => {
            console.log("unsubscribe message");
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChatPage');
    }


    recordigStart() {
        this.audio_name = this.sChat.createFileName('.mp3');

        console.log("sto registrando");
        this.file.createFile(this.base_url, this.audio_name, true).then((result: any) => {
            console.log(this.file, result);
            let file: MediaObject = this.media.create(this.base_url + this.audio_name);
            this.vibration.vibrate(150);
            file.startRecord();
            let self = this;
            let id = setInterval(function () {
                console.log("interval")
                self.count++;
                let minutes = Math.floor(self.count / 60);
                let seconds = self.count - (minutes * 60);
                let minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
                let secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
                self.time_recording = minutesString + ':' + secondsString;
                console.log("self.time_recording = " + self.time_recording);
                if (self.stopRecording) {
                    self.count = 0;
                    console.log("recording end");
                    file.stopRecord();
                    self.stopRecording = false;
                    clearInterval(id);
                    self.recordigEnd(file);
                    console.log("audio play");
                }
            }, 1000);
        });

    }

    recordigEnd(audio) {
        console.log(audio)
        this.sMedia.uploadMedia(this.base_url + this.audio_name, this.audio_name, this.chat.token, 'audio').then(() => {
            //        this.sMedia.saveAudio(this.chat.token, 'audio', this.audio_name, this.base_url + this.audio_name).then((url) => {
            let mm = {'sender': this.sUser.get(), 'text': 'Audio', 'type': 3, 'created_at': Date.now(), 'media': this.base_url + this.audio_name, 'received': 0};
            let mes: Message = new Message(mm);
            mes.seek = 0;
            console.log(mes, 'message');
            this.sChat.sendMessage(mes, this.chat).then((res) => {
                this.chat.messages.push(mes);
                console.log("messaggio inviato");
                console.log(this.chat.messages, 'messages');
                this.message = "";
                window.setTimeout(() => {
                    this.content.scrollToBottom();
                }
                    , 300);
            }).catch((error) => {
                console.log(error, 'errore invio messaggio');
            })
        }).catch((err) => {
            //presentare alert;
        })
    }



    play(message: Message) {
        console.log("play", message.media)
        const audio: MediaObject = this.media.create(message.media);
        let duration = audio.getDuration()
        let self = this;
        let countSecond = 0;
        audio.play();
        audio.getCurrentPosition().then((sec) => {
            console.log("position", sec)
            if (sec < 0) {
                message.seek = 0;
            } else {
                message.seek = Math.ceil(sec);
            }
        })
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

    createThumbnail(message: Message) {
        navigator.createThumbnail(message.media, function (err, imageData) {
            if (err)
                console.log(err);

            console.log('success')
            return imageData;
            //            return "data:image/jpeg;base64," + imageData;
        });
    }


    presentPopoverAttach($event: any) {
        let popover = this.popoverCtrl.create('PopOverAttachPage');
        popover.present({
            ev: $event
        });

        popover.onDidDismiss((popoverData => {
            switch (popoverData) {
                case 'foto':
                    this.capturePhoto();
                    break;
                case 'video':
                    this.captureVideo();
                    break;
                case 'galleriaI':
                    this.openGalleryImages();
                    break;
                //                case 'galleriaV':
                //                    this.openGalleryVideos();
                //                    break;
            }
        }))
    }

    capturePhoto() {
        const options: CameraOptions = {
            quality: 40,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.PNG,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            targetWidth: 720,
        }

        this.camera.getPicture(options).then((imageData) => {
            console.log(imageData, 'imageDAta');
            let file_name = this.sChat.createFileName('.jpg');
            this.sMedia.saveMedia(this.chat.token, 'foto', file_name, imageData).then((url) => {
                let mm = {'sender': this.sUser.get(), 'text': 'Immagine', 'type': 1, 'created_at': Date.now(), 'media': url, 'received': 0};
                let mes: Message = new Message(mm);
                console.log(mes, 'message');
                this.sChat.sendMessage(mes, this.chat).then((res) => {
                    this.chat.messages.push(mes);
                    console.log("messaggio inviato");
                    console.log(this.chat.messages, 'messages');
                    this.message = "";
                    window.setTimeout(() => {
                        this.content.scrollToBottom();
                    }
                        , 300);
                }).catch((error) => {
                    console.log(error, 'errore invio messaggio');
                })
            }).catch((err) => {
                //presentare alert;
            })
        }, (err) => {
            // Handle error
        });

    }

    openGalleryImages() {
        const options: CameraOptions = {
            //            quality: 1,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: this.camera.EncodingType.PNG,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }
        this.camera.getPicture(options).then((imageData) => {
            console.log(imageData, 'imageDAta');
            let file_name = this.sChat.createFileName('.jpg');
            this.sMedia.saveMedia(this.chat.token, 'foto', file_name, imageData).then((url) => {
                let mm = {'sender': this.sUser.get(), 'text': 'Immagine', 'type': 1, 'created_at': Date.now(), 'media': url, 'received': 0};
                let mes: Message = new Message(mm);
                console.log(mes, 'message');
                this.sChat.sendMessage(mes, this.chat).then((res) => {
                    this.chat.messages.push(mes);
                    console.log("messaggio inviato");
                    console.log(this.chat.messages, 'messages');
                    this.message = "";
                    window.setTimeout(() => {
                        this.content.scrollToBottom();
                    }
                        , 300);
                }).catch((error) => {
                    console.log(error, 'errore invio messaggio');
                })
            }).catch((err) => {
                //presentare alert;
            })
        }, (err) => {
            // Handle error
        });

    }

    captureVideo() {
        let options: CaptureVideoOptions = {limit: 1, quality: 0};
        this.mediaCapture.captureVideo(options)
            .then(
            (data: MediaFile[]) => {
                console.log(data[0])
                this.sMedia.saveMedia(this.chat.token, 'video', data[0].name, data[0].fullPath).then((url) => {
                    let mm = {'sender': this.sUser.get(), 'text': 'Video', 'type': 2, 'created_at': Date.now(), 'media': url, 'received': 0};
                    let mes: Message = new Message(mm);
                    console.log(mes, 'message');
                    this.sChat.createThumbnail(data[0].fullPath).then((dataImage) => {
                        mes.thumbnail = dataImage;
                    })
                    this.sChat.sendMessage(mes, this.chat).then((res) => {
                        this.chat.messages.push(mes);
                        console.log("messaggio inviato");
                        console.log(this.chat.messages, 'messages');
                        this.message = "";
                        window.setTimeout(() => {
                            this.content.scrollToBottom();
                        }
                            , 300);
                    }).catch((error) => {
                        console.log(error, 'errore invio messaggio');
                    })
                }).catch(err => {
                    console.log("error save media ", err)
                })
            },
            (err: CaptureError) => console.error(err)
            ).catch((err) => {
                console.log("errore capture video", err)
            })
    }

    navToInfoContatto() {
        if (this.chat instanceof SingleChat) {
            let media: Array<string> = [];

            for (let m of this.chat.messages) {
                if (m.type == 1) {
                    media.push(m.media)
                }
            }
            this.navCtrl.push("InfoContattoPage", {'user': this.chat.participant, 'media': media});
        }
        if (this.chat instanceof ChatRoom) {
            this.navCtrl.push("InfoGruppoPage", {'chat': this.chat});
        }
    }


    sendText() {
        console.log(this.message);
        let mm = {'sender': this.sUser.get(), 'text': this.message, 'type': 0, 'created_at': Date.now(), 'media': null, 'received': 0};
        let mes: Message = new Message(mm);
        console.log(mes, 'message');
        this.sChat.sendMessage(mes, this.chat).then((res) => {
            this.chat.messages.push(mes);
            console.log("messaggio inviato");
            console.log(this.chat.messages, 'messages');
            this.message = "";
            window.setTimeout(() => {
                this.content.scrollToBottom();
            }
                , 300);
        }).catch((error) => {
            console.log(error, 'errore invio messaggio');
        })
    }

    ionViewDidEnter() {
        this.content.scrollToBottom();
    }

}
