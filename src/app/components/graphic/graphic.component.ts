import {Component, Input, OnInit, OnChanges} from '@angular/core';

declare var F2: any;

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit, OnChanges {
  @Input() charts;
  @Input() userCount;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {

    const data = [];
    const ticks = [];
    let _ticks = [];
    changes.charts.currentValue.forEach((item, i) => {
      if (i % 2 === 0) {
        ticks.push(item.productperiod);
      }

      _ticks = [
        0,
        (this.userCount * 0.2).toFixed(0),
        (this.userCount * 0.4).toFixed(0),
        (this.userCount * 0.6).toFixed(0),
        (this.userCount * 0.8).toFixed(0),
        this.userCount
      ];

      const obj = {
        a: item.productperiod,
        b: item.buySeq
      };
      data.push(obj);
    });
    const chart = new F2.Chart({
      id: 'mountNode',
      width: window.innerWidth,
      height: window.innerWidth > window.innerHeight ? (window.innerHeight - 54) : window.innerWidth * 0.707,
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data, {
      b: {
        range: [0, 1],
        ticks: _ticks,
      },
      a: {
        range: [0, 1],
        ticks: ticks
      }
    });
    chart.tooltip({
      showItemMarker: true,
      showCrosshairs: true,
      onShow(ev) {
        const {items} = ev;
        items[0].name = items[0].title;
      }
    });
    chart.axis('a', {
      label(text, index, total) {
        const textCfg = {textAlign: ''};
        if (index === 0) {
          textCfg.textAlign = 'left';
        }
        if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });

    data.map(function (obj) {
      chart.guide().text({
        position: [obj.a, obj.b],
        content: obj.b,
        style: {
          textBaseline: 'bottom',
          textAlign: 'center'
        },
        offsetY: -2
      });
    });

    chart.line()
      .position('a*b').shape('smooth');
    chart.point().position('a*b').shape('smooth').style({
      stroke: '#fff',
      lineWidth: 1
    });
    chart.render();
  }

}
