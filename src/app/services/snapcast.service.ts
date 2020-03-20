import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Group } from '../types/group';
import { Stream } from '../types/stream';
import { Client } from '../types/client';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SnapcastService {

  connection: any;
  server: any = {};
  serverStatusRequestId = 1;
  changeSettingRequestId: number = 2;
  changeGroupClientRequestId: number = 3;
  constructor(private messageService: MessageService) {
    this.connection = new WebSocket('ws://' + environment.snapcastIp + ':' + environment.snapcastPort + '/jsonrpc');
    const that = this;
    this.connection.onmessage = function (message) {
      var recv = message.data;
      //console.log(message);

      var answer = JSON.parse(recv);
      console.log(answer);
      if (answer.id === that.serverStatusRequestId || answer.id === that.changeGroupClientRequestId) {
        that.server = answer.result;
        that.publishChange();
      } else if (Array.isArray(answer)) {
        for (let i = 0; i < answer.length; i++) {
          that.action(answer[i]);
        }
      } else {
        that.action(answer);
      }
    }

    this.connection.onopen = function () {
      that.getStatus();
    }

    this.connection.onerror = function () {
      alert("error");
    }
    window.onbeforeunload = function () {
      console.log('onbeforeunload');
      that.connection.onclose = function () { }; // disable onclose handler first
      that.connection.close();
    };
  }

  private publishChange() {
    this.messageService.broadcast("SnapcastServerUpdate", this.server.server);
  }

  private action(answer) {
    switch (answer.method) {
      case 'Client.OnVolumeChanged':
      case 'Client.OnLatencyChanged':
      case 'Client.OnNameChanged':
        this.clientChange(answer.params);
        break;
      case 'Client.OnConnect':
      case 'Client.OnDisconnect':
        this.clientConnect(answer.params);
        break;
      case 'Group.OnMute':
        this.groupMute(answer.params);
        break;
      case 'Group.OnStreamChanged':
        this.groupStream(answer.params);
        break;
      case 'Stream.OnUpdate':
        this.streamUpdate(answer.params);
        break;
      case 'Server.OnUpdate':
        this.server = answer.params;
        break;
      default:
        break;
    }
    this.publishChange();
  }

  private clientChange(params) {
    // Update the client configuration with one from params
    for (let i_group = 0; i_group < this.server.server.groups.length; i_group++) {
      for (let i_client = 0; i_client < this.server.server.groups[i_group].clients.length; i_client++) {
        if (this.server.server.groups[i_group].clients[i_client].id == params.id) {
          this.server.server.groups[i_group].clients[i_client].config = Object.assign(this.server.server.groups[i_group].clients[i_client].config, params);
        }
      }
    }
  }

  private clientConnect(params) {
    // Update all client info
    for (let i_group = 0; i_group < this.server.server.groups.length; i_group++) {
      for (let i_client = 0; i_client < this.server.server.groups[i_group].clients.length; i_client++) {
        if (this.server.server.groups[i_group].clients[i_client].id == params.client.id) {
          this.server.server.groups[i_group].clients[i_client] = params.client;
          //  console.log(server.server.groups[i_group].clients[i_client]); 
        }
      }
    }
  }

  private groupMute(params) {
    // Set group mute boolean
    for (let i_group = 0; i_group < this.server.server.groups.length; i_group++) {
      if (this.server.server.groups[i_group].id == params.id) {
        this.server.server.groups[i_group].muted = params.mute;
      }
    }
  }

  private groupStream(params) {
    // Set group stream id
    for (let i_group = 0; i_group < this.server.server.groups.length; i_group++) {
      if (this.server.server.groups[i_group].id == params.id) {
        this.server.server.groups[i_group].stream_id = params.stream_id;
      }
    }
  }

  private streamUpdate(params) {
    this.getStatus();
  }

  getStatus() {
    this.send('{"id":' + this.serverStatusRequestId + ',"jsonrpc":"2.0","method":"Server.GetStatus"}');
  }

  private send(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }

    var recv = String.fromCharCode.apply(null, new Uint8Array(buf));

    this.connection.send(buf)
  }

  updateClientVolume(client: Client) {
    if (client.config.volume.percent < 0) {
      client.config.volume.percent = 0
    }
    else if (client.config.volume.percent > 100) {
      client.config.volume.percent = 100
    }

    // Request changes
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Client.SetVolume","params":{"id":"' + client.id + '","volume":{"muted":' + client.config.volume.muted + ',"percent":' + client.config.volume.percent + '}}}')
  }

  updateGroupMute(group: Group) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Group.SetMute","params":{"id":"' + group.id + '","mute":' + group.muted + '}}')
  }

  updateGroupStream(group: Group) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Group.SetStream","params":{"id":"' + group.id + '","stream_id":"' + group.stream_id + '"}}')
  }

  createSpotifyStream(name: string) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Stream.AddStream","params":{"streamUri":"spotify:///librespot?name=' + name + '&devicename=' + name + '&bitrate=320"}}')
  }

  updateGroupName(group: Group) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Group.SetName","params":{"id":"' + group.id + '","name":"' + JSON.stringify(group.name).split('"').join('\\"') + '"}}')
  }

  updateClientsInGroup(group: Group) {
    this.send('{"id":' + this.changeGroupClientRequestId + ',"jsonrpc":"2.0","method":"Group.SetClients","params":{"clients":' + JSON.stringify(group.clients.map(client => client.id)) + ',"id":"' + group.id + '"}}')
  }

  updateClientName(client: Client) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Client.SetName","params":{"id":"' + client.id + '","name":"' + JSON.stringify(client.config.name).split('"').join('\\"') + '"}}')
  }
  setClientLatency(clientId, latency) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Client.SetLatency","params":{"id":"' + clientId + '","latency":' + latency + '}}')
  }
}
