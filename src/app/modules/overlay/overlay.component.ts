import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {OverlayService} from './overlay.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit, OnChanges {

  state;
  @Input() autoHeight?;

  constructor(private overlaySvc: OverlayService) {
    overlaySvc.get().subscribe(res => {
      this.state = res;
    });
  }

  ngOnInit() {
  }

  hide() {
    this.overlaySvc.hide();
  }

  ngOnChanges() {
  }
}
