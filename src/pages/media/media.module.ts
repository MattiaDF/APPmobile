import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MediaPage} from './media';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {StreamingMedia} from '@ionic-native/streaming-media';


@NgModule({
    declarations: [
        MediaPage,
    ],
    imports: [
        IonicPageModule.forChild(MediaPage),
    ],
    exports: [
        MediaPage
    ],
    providers: [
        PhotoViewer,
        StreamingMedia,
    ]
})
export class MediaPageModule {}
