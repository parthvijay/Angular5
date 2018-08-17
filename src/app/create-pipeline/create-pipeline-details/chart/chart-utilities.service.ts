import { element } from 'protractor';
import { Injectable } from '@angular/core';
import * as tinycolor from 'tinycolor2';

@Injectable()
export class ChartUtilitiesService {

  constructor() { }

  getUniqueKeys(data) {
    // console.log(data);
    const keys: Array<any> = [];
    data.forEach(element => {
      element.areas.forEach(element_2 => {
        const object = element_2.freq;
        for (const key in object) {
          if (object.hasOwnProperty(key) && keys.indexOf(key) === -1) {
            keys.push(key);
          }
        }
      });
    });
    keys.sort();
    return keys;
  }

  getActive(active, type, d3) {
    if (active.indexOf(type) > -1) {
      if (d3.event.ctrlKey || d3.event.metaKey) {
        active.splice(active.indexOf(type), 1);
      } else {
        if (active.length === 1) {
          active = [];
        } else {
          active = [];
          active.push(type);
        }
      }
    } else {
      if (!d3.event.ctrlKey && !d3.event.metaKey) {
        active = [];
      }
      active.push(type);
    }
    active.sort();
    return active;
  }

  wrapAxisText(selection, d3) {

    const width = 70;

    selection.each(function () {

      const breakChars = ['/', '&', '-'];
      const text = d3.select(this);
      let textContent = text.text();
      let quarter = false;
      let spanContent;
      let words;
      let ind;
      let count = 0;

      breakChars.forEach(char => {
        // Add a space after each break char for the function to use to determine line breaks
        textContent = textContent.replace(char, char + ' ');
      });

      ind = textContent.indexOf('FY');

      if (ind === -1) {
        ind = textContent.indexOf('yrs');
      }
      if (ind > 0) {
        words = [textContent.substring(0, ind).trim(), textContent.substring(ind, textContent.length).trim()];
        quarter = true;
      } else {
        words = textContent.split(/\s+/);
      }

      words.reverse();

      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      let x = text.attr('x');
      x = x ? x : 0.5;
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy') || 0);
      let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width || (quarter && count > 0)) {
          line.pop();
          spanContent = line.join(' ');
          breakChars.forEach(char => {
            // Remove spaces trailing breakChars that were added above
            spanContent = spanContent.replace(char + ' ', char);
          });
          tspan.text(spanContent);
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
        count++;
      }
    });
  }

  getDarkColor(color) {
    return tinycolor(color).darken(8).toString();
  }

}
