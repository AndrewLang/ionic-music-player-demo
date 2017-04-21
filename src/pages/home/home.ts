import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { MusicControls } from '@ionic-native/music-controls';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
//import { MediaPlugin } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //media: MediaPlugin;
  mediaFile: MediaObject;
  duration: number;
  position: number;
  constructor(public navCtrl: NavController,
    private media: MediaPlugin,
    private backgroundMode: BackgroundMode,
    private musicControls: MusicControls,
    private platform: Platform) {

  }
  Play(): void {
    let url = "https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3";
    console.log(`music to play ${url}`);
    const onStatusUpdate = (status) => console.log(`Player status changed: ${status}`);

    this.platform.ready().then(() => {

      this.media.create(url, onStatusUpdate)
        .then(result => {
          console.log("start to play");
          console.log(url);
          this.mediaFile = result;

          this.mediaFile.play();

          this.InitializePlayControls();
          this.backgroundMode.enable();

        })
        .catch(error => console.log(error));


    });
  }
  Pause(): void {
    if (this.mediaFile)
      this.mediaFile.pause();

    this.backgroundMode.disable();
  }

  private InitializePlayControls(): void {
    let options = {
      track: "Test album",
      artist: "Test album",
      cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Record-Album-02.jpg/640px-Record-Album-02.jpg",
      isPlaying: true,
      dismissable: true,
      hasPrev: false,
      hasNext: false,
      hasClose: false,
      album: "Test album",
      duration: this.duration,
      elapsed: this.position,
      ticker: ''
    };
    console.log("Music control options");
    console.log(options);

    this.musicControls.create(options)
      .then(response => {
        console.log(`music controls created: ${response}`);
      });

    this.musicControls.subscribe().subscribe(action => {
      switch (action) {
        case 'music-controls-next':
          //this.Next();
          console.log("Music control next");
          break;
        case 'music-controls-previous':
          //this.Previous();
          console.log("Music control previous");
          break;
        case 'music-controls-pause':
          this.Pause();
          console.log("Music control pause");
          break;
        case 'music-controls-play':
          this.Play();
          console.log("Music control play");
          break;
        case 'music-controls-destroy':
          //this.Stop();
          console.log("Music control stop");
          break;

        // Headset events (Android only)
        case 'music-controls-media-button':
          // Do something
          console.log("Music control media");
          break;
        case 'music-controls-headset-unplugged':
          // Do something
          console.log("Music control headset unplugged");
          break;
        case 'music-controls-headset-plugged':
          // Do something
          console.log("Music control headset plugged");
          break;
        default:
          break;
      }

    });

    this.musicControls.listen();
  }
}
