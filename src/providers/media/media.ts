import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {File, FileEntry, DirectoryEntry} from '@ionic-native/file';
import {UUID} from 'angular2-uuid';
import {MediaFile} from '@ionic-native/media-capture';
import {StorageProvider} from '../../providers/storage/storage';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';


//my models
import {Message} from "../../models/message"

import {URL} from "../../constants";
/*
  Generated class for the MediaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MediaProvider {
    public fileTransfer: FileTransferObject = this.transfer.create();

    public file: File;
    constructor(public http: Http, private sStorage: StorageProvider, private transfer: FileTransfer) {
        console.log('Hello MediaProvider Provider');
        this.file = new File();
    }

    createFormData(url_img, file_name) {
        return new Promise((resolve) => {
            let file: File = new File();
            file.resolveLocalFilesystemUrl(url_img)
                .then(entry => (<FileEntry> entry).file(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const formData = new FormData();
                        const imgBlob = new Blob([reader.result], {type: file.type});
                        formData.append('file', imgBlob, file_name);
                        resolve(formData);
                    };
                    reader.readAsArrayBuffer(file);
                }))
                .catch(err => console.log(err));

        })
    }

    downloadMedia(chat_token, url_media, type) {
        return new Promise((resolve) => {
            //        const fileTransfer: FileTransferObject = this.transfer.create();
            if (url_media == '' || url_media == undefined) {
                resolve('');
            } else {

                const url = this.sStorage.getServerAddress() + URL.CHATS.MEDIA + chat_token + '/' + url_media + '?token=' + this.sStorage.getUser().token + '&type=' + type;
                this.fileTransfer.download(url, this.file.externalApplicationStorageDirectory + 'media/' + chat_token + '/' + type + '/' + url_media).then((entry) => {
                    console.log('download complete: ' + entry.toURL());
                    resolve(entry.toURL());
                }, (error) => {
                    // handle error
                    console.log('download error: ', error);
                });
            }
        })
    }

    saveMedia(chat_token, type: string, file_name, file_fullpath): Promise<string> {
        return new Promise((resolve, reject) => {
            let self = this;
            this.inizializeChatFolder(chat_token).then(() => {
                console.log(' url directory: ', this.file.externalApplicationStorageDirectory + 'media/' + chat_token + '/' + type + '/')
                this.getDirectoryEntry(this.file.externalApplicationStorageDirectory + 'media/' + chat_token + '/' + type + '/').then((directoryEntry: DirectoryEntry) => {
                    console.log("sono dentro resolve getDirectoyEntry", directoryEntry)
                    this.file.resolveLocalFilesystemUrl(file_fullpath).then(entry => {
                        console.log("sono dentro resolve resolveLocalFilesystemUrl", entry);
                        (<FileEntry> entry).copyTo(directoryEntry, file_name, function (copiedEntry) {
                            console.log('success copy file', copiedEntry.nativeURL);
                            let nativeUrl = copiedEntry.nativeURL;
                            self.uploadMedia(nativeUrl, file_name, chat_token, type).then(() => {
                                console.log("then upload media")
                                resolve(copiedEntry.nativeURL);
                            }).catch((err) => {
                                console.log("error upload media", err)
                                reject(err);
                            })
                        })
                    }).catch((err) => {
                        console.log(err, 'errore resolve local file')
                        reject(err);
                    });

                }).catch(err => {
                    console.log("errore resolve directory ", err)
                    reject(err);
                })
            })
        })
    }

    //    saveAudio(chat_token, type: string, file_name, file_fullpath): Promise<string> {
    //        return new Promise((resolve, reject) => {
    //            let self = this;
    //            console.log(file_fullpath, 'full path save audio')
    //            this.file.resolveLocalFilesystemUrl(file_fullpath).then((entry => {
    //                this.uploadMedia(chat_token, type, <FileEntry> entry).then(() => {
    //                    console.log("then upload media")
    //                }).catch((err) => {
    //                    console.log("error upload media", err)
    //                    //                                                        reject(err);
    //                });
    //                resolve(entry.nativeURL);
    //            })).catch((err) => {
    //                console.log(err, 'errore resolve local file')
    //                reject(err);
    //            });
    //        })
    //    }

    //    uploadMedia(chat_token, type, media: FileEntry): Promise<any> {
    //        return new Promise((resolve, reject) => {
    //            media.file(file => {
    //                const reader = new FileReader();
    //                reader.onloadend = () => {
    //                    const formData = new FormData();
    //                    const imgBlob = new Blob([reader.result], {type: file.type});
    //                    formData.append('file', imgBlob, media.name);
    //                    formData.append('type', type);
    //                    var headers = new Headers();
    //                    headers.append('token', this.sStorage.getUser().token);
    //                    let options = new RequestOptions({headers: headers});
    //                    this.http.post(this.sStorage.getServerAddress() + URL.CHATS.MEDIA + chat_token, formData, options)
    //                        .toPromise()
    //                        .then((res: Response) => {
    //                            console.log("success post call");
    //                            resolve();
    //                        })
    //                        .catch((err: Response) => {
    //                            console.log(`Errore status: ${err.status}`)
    //                            reject(err);
    //                        });
    //                };
    //                reader.readAsArrayBuffer(file);
    //            });
    //
    //        })
    //    }
    getDirectoryEntry(path): Promise<DirectoryEntry> {
        return new Promise((resolve, reject) => {
            this.file.resolveDirectoryUrl(path).then(directoryEntry => {
                console.log(directoryEntry.fullPath, 'fullpath')
                resolve(directoryEntry);
            }).catch((err) => {
                console.log('errore resove directory', err)
                reject(err);
            })
        })
    }

    inizializeChatFolder(chatToken: string): Promise<any> {
        return new Promise((resolve) => {

            this.file.createDir(this.file.externalApplicationStorageDirectory + 'media', chatToken, false).then(() => {
                this.file.createDir(this.file.externalApplicationStorageDirectory + 'media/' + chatToken + '/', 'audio', false).then(() => {
                    this.file.createDir(this.file.externalApplicationStorageDirectory + 'media/' + chatToken + '/', 'video', false).then(() => {
                        this.file.createDir(this.file.externalApplicationStorageDirectory + 'media/' + chatToken + '/', 'foto', false).then(() => {
                            console.log("create tutte le cartelle media per la chat ", chatToken);
                            resolve()
                        }).catch((err) => {
                            console.log(err, 'errore creazione folder foto')
                            resolve(err);
                        })
                    }).catch((err) => {
                        console.log(err, 'errore creazione folder video')
                        resolve(err);
                    })
                }).catch((err) => {
                    console.log(err, 'errore creazione folder audio')
                    resolve(err);
                })
            }).catch((err) => {
                console.log(err, 'errore creazione folder chat')
                resolve(err);
            })
        })

    }

    getUrlMedia(chat_token, type, file_name) {
        return this.file.externalApplicationStorageDirectory + chat_token + '/' + type + '/' + file_name;
    }


    uploadImageUser(url_media, user): Promise<any> {
        return new Promise((resolve, reject) => {
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: 'icon.jpg',
                headers: {
                    'token': this.sStorage.getUser().token
                },
                params: {
                    'name': user.name
                }
            }
            let api_url = this.sStorage.getServerAddress() + URL.USERS.UPDATE;

            this.fileTransfer.upload(url_media, api_url, options)
                .then((data) => {
                    resolve()
                }, (err) => {
                    reject(err)
                })
        })
    }

    uploadImageChat(url_media, file_name, chat): Promise<any> {
        return new Promise((resolve, reject) => {
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: file_name,
                headers: {
                    'token': this.sStorage.getUser().token
                },
                params: {
                    'name': chat.name
                }
            }
            let api_url = this.sStorage.getServerAddress() + URL.CHATS.UPDATE + chat.token;

            this.fileTransfer.upload(url_media, api_url, options)
                .then((data) => {
                    resolve()
                }, (err) => {
                    reject(err)
                })
        })
    }

    uploadMedia(url_media, file_name, token, type): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("sono dentro upload media")
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: file_name,
                headers: {
                    'token': this.sStorage.getUser().token
                },
                params: {
                    'type': type
                }
            }
            let api_url = this.sStorage.getServerAddress() + URL.CHATS.MEDIA + token;
            console.log('file trasfert', api_url, options)
            this.fileTransfer.upload(url_media, api_url, options)
                .then((data) => {
                    console.log("sono dentro RESOLVE upload media")
                    resolve()
                }, (err) => {
                    console.log("sono dentro REJECT upload media")
                    reject(err)
                }).catch((err) => {
                    console.log("sono dentro REJECT upload media")
                    reject(err)

                })
        })
    }
}