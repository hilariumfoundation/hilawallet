import {Component, OnInit} from '@angular/core';
import {NetworkService} from './network.service';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  update: boolean;
  ipc: any;
  users: any = [];

  constructor(public network: NetworkService) {
    this.update = false;
  }

  // checkUpdate() {
  //   this.ipc['send']('checkUpdate', null);
  // }

  // performUpdate() {
  //   // this.ipc['send']('startUpdate', null);
  //   window['shell'].openExternal('https://hilarium.foundtion/hila/');
  // }
  //
  // openGithub() {
  //   window['shell'].openExternal('https://github.com/hilariumfoundation/hila/releases/latest');
  // }

  async ngOnInit() {
    // if (window['ipcRenderer']) {
    //   this.ipc = window['ipcRenderer'];
    //   this.ipc.on('update_ready', (event, data) => {
    //     this.update = data;
    //   });
    //   setTimeout(() => {
    //     this.checkUpdate();
    //   }, 5000);
    // }
    console.log('It is waiting for connecting...');
    var connect = this.network.connect();
    await connect;
  }
}
