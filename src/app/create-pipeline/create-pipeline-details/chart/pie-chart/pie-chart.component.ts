import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

import { ColorsService } from '../colors.service';
import { ChartUtilitiesService } from '../chart-utilities.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  private margin: any = { top: 20, bottom: 20, left: 0, right: 0 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private transitionDuration = 500;
  private colors: any;
  private keys: Array<any>;
  private pD: Array<any>;
  private table: any;
  private g: any;
  @Input() private active: Array<any>;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onActiveChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private colorsService: ColorsService, private chartUtilitiesService: ChartUtilitiesService) { }

  ngOnInit() {
    this.calcData();
    this.createChart();
    // this.createLegends();
    // if (this.chart) {
    //   this.updateChart();
    // }
  }

  // ngOnChanges() {
  //   if (this.chart) {
  //     this.updateChart();
  //   }
  // }

  getColor(d) {
    return this.colors[d];
  }

  calcData() {
    this.keys = this.chartUtilitiesService.getUniqueKeys(this.data);
    this.colors = this.colorsService.getColors(this.keys);
    const fData = <any>[];
    this.data.forEach(function (d) {
      const o = <any>{};
      o.state = d.quarter;
      o.freq = {};
      const areas = d.areas;
      areas.forEach(function (e) {
        const b = e.freq;
        for (const prop in b) {
          if (typeof o.freq[prop] !== 'undefined') {
            o.freq[prop] += b[prop];
          } else {
            o.freq[prop] = b[prop];
          }
        }
      });
      fData.push(o);
    });

    this.pD = this.keys.map(function (d) {
      return {
        state: d, freq: fData.map(function (t) {
          return { key: t.state, value: t.freq[d] };
        }), total: d3.sum(fData.map(function (t) {
          return t.freq[d];
        }))
      };
    });
  }

  toggleSelection(d, thisInstance) {
    const type = d.data ? d.data.state : d;
    const active = thisInstance.chartUtilitiesService.getActive(thisInstance.active, type, d3);
    this.onActiveChange.emit(active);
  }

  bar_mouseover(i, thisInstance) {
    thisInstance.g.select('path.front.front_' + i)
      .style('fill', function (e) {
        const color = thisInstance.getColor(e.data.state);
        if (e.data.disabled) {
          return color;
        }
        return thisInstance.chartUtilitiesService.getDarkColor(color);
      });
  }

  bar_mouseout(i, thisInstance) {
    thisInstance.g.select('path.front.front_' + i)
      .style('fill', function (e) {
        const color = thisInstance.getColor(e.data.state);
        if (e.data.disabled) {
          return '#ccc';
        }
        return color;
      });
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.height = 275;
    const pieDimr = Math.min(this.width, this.height) / 2.32;
    const svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const pieTotal = d3.sum(this.pD.map(function (t) {
      return t.total;
    }));
    const thisInstance = this;

    // chart plot area
    this.chart = svg.append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    const arc = d3.arc().outerRadius(pieDimr * 0.8).innerRadius(pieDimr * 0.48);
    const pie = d3.pie().sort(null).value(function (d) {
      return d.total;
    }).padAngle(0.02);

    this.g = this.chart.selectAll('.arc')
      .data(pie(this.pD))
      .enter().append('g')
      .attr('class', 'arc');

    this.g.append('path')
      .attr('class', function (d, i) {
        return 'front front_' + i;
      })
      .attr('d', arc)
      .style('fill', (d, i) => this.getColor(d.data.state))
      .on('click', function (d) {
        thisInstance.toggleSelection(d, thisInstance);
      })
      .on('mouseover', function (d, i) {
        thisInstance.bar_mouseover(i, thisInstance);
      })
      .on('mouseout', function (d, i) {
        thisInstance.bar_mouseout(i, thisInstance);
      });

    this.g.append('text')
      .text(function (d) {
        let val = d3.format(',.3s')(d.value);
        val = (val.replace('G', 'B'));
        return val;
      })
      .attr('transform', function (d) {
        const c = arc.centroid(d),
          x = c[0],
          y = c[1],
          h = Math.sqrt(x * x + y * y);
        if (!h) {
          return 'translate(0,0)';
        }
        return 'translate(' + (x / h * (pieDimr - 15)) + ',' +
          (y / h * (pieDimr - 10)) + ')';
      })

      .attr('dy', function (d) {
        return 0.35 + 'em';
      })
      .attr('text-anchor', function (d, i) {
        return ((d.endAngle + d.startAngle) / 2 > Math.PI) ?
          'end' : 'start';
      })
      .style('font-size', '11px');

    this.chart.append('text')
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .attr('dy', '0.4em')
      .text(function () {
        let val = d3.format(',.3s')(pieTotal);
        val = (val.replace('G', 'B'));
        return '$' + val;
      });
  }

  createLegends() {

    const element = this.chartContainer.nativeElement;
    const thisInstance = this;

    const len = this.keys.length;
    let legendClass = '';
    if (len > 3) {
      legendClass = 'threePlus';
    } else if (len === 3) {
      legendClass = 'three';
    } else if (len === 2) {
      legendClass = 'two';
    } else if (len === 1) {
      legendClass = 'one';
    }

    this.table = d3.select(element).append('table');
    const legend = this.table.attr('class', 'legend ' + legendClass);
    const tr = legend.append('tbody').append('tr');
    const td = tr.selectAll('td').data(this.keys).enter().append('td');
    const div = td.append('div').on('click', function (d) {
      thisInstance.toggleSelection(d, thisInstance);
    });

    div.append('svg').attr('width', '8').attr('height', '8').append('rect')
      .attr('width', '8').attr('height', '8')
      .attr('fill', (d, i) => this.getColor(d));

    div.append('text')
      .text(function (d) {
        return d;
      });
  }

  // updateChart() {
  //   const thisInstance = this;
  //   thisInstance.g.selectAll('path').transition().duration(500)
  //     .style('fill', function (e) {
  //       if (thisInstance.active.length && thisInstance.active.indexOf(e.data.state) === -1) {
  //         e.data.disabled = true;
  //         return '#ccc';
  //       }
  //       e.data.disabled = false;
  //       return thisInstance.colors[e.data.state];
  //     });

  //   thisInstance.table.selectAll('td').attr('class', function (e) {
  //     if (thisInstance.active.length && thisInstance.active.indexOf(e) === -1) {
  //       return 'disabled';
  //     }
  //     return '';
  //   });
  // }

}
