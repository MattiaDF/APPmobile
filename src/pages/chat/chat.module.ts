import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ChatPage} from './chat';
import {ElasticModule} from 'angular2-elastic';
import {Camera} from '@ionic-native/camera';
import {File} from '@ionic-native/file';
import {MediaPlugin} from '@ionic-native/media';
import {MediaCapture} from '@ionic-native/media-capture';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {StreamingMedia} from '@ionic-native/streaming-media';


@NgModule({
    declarations: [
        ChatPage,
    ],
    imports: [
        IonicPageModule.forChild(ChatPage),
        ElasticModule,

    ],
    exports: [
        ChatPage
    ],
    providers: [
        File,
        Camera,
        MediaCapture,
        MediaPlugin,
        PhotoViewer,
        StreamingMedia,
    ]
})
export class ChatPageModule {}
