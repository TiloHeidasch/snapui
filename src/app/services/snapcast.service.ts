import { ErrorHandler, Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Group } from '../types/group';
import { Stream } from '../types/stream';
import { Client } from '../types/client';


@Injectable({
  providedIn: 'root'
})
export class SnapcastService {

  connection: any;
  server: any = {};
  serverStatusRequestId = 1;
  changeSettingRequestId: number = 2;
  constructor(private messageService: MessageService) {
    this.connection = new WebSocket('ws://10.0.1.10:80/jsonrpc');
    const that = this;
    this.connection.onmessage = function (message) {
      var recv = message.data;
      //console.log(message);

      var answer = JSON.parse(recv);
      console.log(answer);
      if (answer.id === that.serverStatusRequestId) {
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
  }

  private publishChange() {
    this.messageService.broadcast("SnapcastServer", this.server.server);
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
      case 'Group.OnStremChanged':
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
    // Update all stream inforamtion
    for (let i_stream = 0; i_stream < this.server.server.streams.length; i_stream++) {
      if (this.server.server.streams[i_stream].id == params.id) {
        this.server.server.streams[i_stream] = params.stream;
        //  console.log(server.server.streams[i_stream]); 
      }
    }
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

  setStream(group: Group, stream: Stream) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Group.SetStream","params":{"id":"' + group.id + '","stream_id":"' + stream.id + '"}}')
  }
  updateGroupName(group: Group) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Group.SetName","params":{"id":"' + group.id + '","name":"' + group.name + '"}}')
  }

  updateClientsInGroup(group: Group) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Group.SetClients","params":{"clients":' + group.clients + ',"id":"' + group.id + '"}}')
  }

  updateClientName(client: Client) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Client.SetName","params":{"id":"' + client.id + '","name":"' + client.config.name + '"}}')
  }
  setClientLatency(clientId, latency) {
    this.send('{"id":' + this.changeSettingRequestId + ',"jsonrpc":"2.0","method":"Client.SetLatency","params":{"id":"' + clientId + '","latency":' + latency + '}}')
  }
}
