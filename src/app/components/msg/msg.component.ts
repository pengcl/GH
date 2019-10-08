import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

declare interface Msg {
  title?: String;
  decs?: String;
  icon?: String;
  confirm?: String;
  cancel?: String;
}

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})
export class MsgComponent implements OnInit {
  @Input() msg;
  @Output() event: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  confirm() {
    this.event.emit('confirm');
  }

  cancel() {
    this.event.emit('cancel');
  }

}
