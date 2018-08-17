import { Injectable } from '@angular/core';

@Injectable()
export class ColorsService {

  colorsPalette: any = {
    'colors_3': ['#4770b3', '#cad93f', '#65338d'],
    'colors_6': ['#4770b3', '#267278', '#e4b031', '#50aed3', '#cad93f', '#9e9ea2'],
    // tslint:disable-next-line:max-line-length
    'colors_13': ['#267278', '#65338d', '#4770b3', '#d21f75', '#3b3689', '#50aed3', '#48b24f', '#e57438', '#569dd2', '#569d79', '#58595b', '#e4b031', '#84d2f4'],
    'colors': ['#267278', '#65338d', '#4770b3', '#d21f75', '#3b3689', '#50aed3', '#48b24f', '#e57438', '#569dd2', '#569d79', '#58595b', '#e4b031', '#84d2f4', '#cad93f', '#f5c8af', '#9ac483', '#9e9ea2', '#f4dfad', '#eaf0b2', '#ba8268', '#a8c7c9', '#a385bb', '#91a9d1', '#eda5c8', '#b9dfed', '#b6e0b9', '#efac88', '#dedede']
  };

  colors: any = {};

  constructor() { }

  getColors(keys) {
    const k = keys.sort();
    const keys_length = k.length;
    let theme: any;

    if (keys_length <= 3) {
      theme = 'colors_3';
    } else if (keys_length <= 6) {
      theme = 'colors_6';
    } else if (keys_length <= 13) {
      theme = 'colors_13';
    } else {
      theme = 'colors';
    }

    k.forEach(element => {
      if (!this.colors[element]) {
        const size = Object.keys(this.colors).length;
        this.colors[element] = this.colorsPalette[theme][size];
      }
    });
    return this.colors;
  }

}
