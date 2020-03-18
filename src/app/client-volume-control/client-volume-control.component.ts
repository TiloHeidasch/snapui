import { Component, Input } from '@angular/core';
import { Client } from '../types/client';
import { SnapcastService } from '../services/snapcast.service';

@Component({
  selector: 'client-volume-control',
  templateUrl: './client-volume-control.component.html',
  styleUrls: ['./client-volume-control.component.scss']
})
export class ClientVolumeControlComponent {
  @Input() client: Client;
  volumeStep: number = 5;

  constructor(private snapcast: SnapcastService) { }

  reduceClientVolume(client: Client) {
    client.config.volume.percent -= this.volumeStep;
    this.snapcast.updateClientVolume(client);
  }
  increaseClientVolume(client: Client) {
    client.config.volume.percent += this.volumeStep;
    this.snapcast.updateClientVolume(client);
  }
  setClientVolume(client: Client, percent: number) {
    client.config.volume.percent = percent;
    this.snapcast.updateClientVolume(client);
  }
  muteClient(client: Client) {
    client.config.volume.muted = !client.config.volume.muted;
    this.snapcast.updateClientVolume(client);
  }

}
