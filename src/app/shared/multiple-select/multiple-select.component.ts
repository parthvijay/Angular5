import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { MultipleSelectService } from '../multiple-select/multiple-select.service';
import { UtilitiesService } from '../services/utilities.service';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent implements OnInit, OnChanges {

  @Input() modelArr;
  @Output() modelChange = new EventEmitter();
  @Input() suggestionsArr;

  selectedItemIndex = 0;
  isHover = false;
  isFocused = false;
  objectProperty = 'name';
  inputValue = '';
  isRequired = false;
  errMsgRequired = false;
  name = 'email';
  suggestionsArrFiltered;

  constructor(
    private multipleSelectService: MultipleSelectService,
    public utilitiesService: UtilitiesService,
    public loaderService: LoaderService
  ) { }

  ngOnInit() {
    if (!this.modelArr || !this.modelArr.length) {
      this.modelArr = [];
    }
    if (!this.suggestionsArr || !this.suggestionsArr.length) {
      this.suggestionsArr = [];
    }
    this.suggestionsArrFiltered = this.suggestionsArr;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.modelArr.currentValue.length === 0) {
      this.filterValues('');
    }
    document.getElementById('emailID').focus();
  }

  onFocus() {
    this.isFocused = true;
  }

  onMouseEnter() {
    this.isHover = true;
  }

  onMouseLeave() {
    this.isHover = false;
  }

  onBlur() {
    this.isFocused = false;
  }

  onChange() {
    this.selectedItemIndex = 0;
    this.suggestionsArr.forEach(element => {
      if (element.email === this.inputValue) {
        this.onSuggestedItemsClick(element);
      }
    });
  }

  // Live Code
  filterValues(value: string) {
    const val = value.toLowerCase();
    const thisInstance = this;
    if (val.length === 0) {
      this.suggestionsArr = [];
      this.suggestionsArrFiltered = this.suggestionsArr;
    }
    if (val.length > 3) {
      this.multipleSelectService.searchUserEmail(val)
        .subscribe((data: any) => {
          this.loaderService.hide();
          this.suggestionsArr = data.userDetails;
          this.suggestionsArrFiltered = this.suggestionsArr;
        },
        error => {
          this.loaderService.hide();
        });
    }
  }

  keyParser($event) {
    const keys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      8: 'backspace',
      13: 'enter',
      9: 'tab',
      27: 'esc'
    };
    const key = keys[$event.keyCode];
    if (key === 'up' || key === 'down') {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (!key) {
      this.filterValues(this.inputValue);
    }
    if (key === 'backspace' && this.inputValue === '') {
      if (this.modelArr.length !== 0) {
        this.removeAddedValues(this.modelArr[this.modelArr.length - 1]);
      }
    } else if (key === 'down' && this.selectedItemIndex < this.suggestionsArrFiltered.length - 1) {
      this.selectedItemIndex++;
    } else if (key === 'up' && this.selectedItemIndex > 0) {
      this.selectedItemIndex--;
    } else if (key === 'enter') {
      this.onSuggestedItemsClick(this.suggestionsArrFiltered[this.selectedItemIndex]);
    }
    $('.autocomplete-list').scrollTop(this.selectedItemIndex * $('.autocomplete-list li').outerHeight());
  }

  onSuggestedItemsClick(selectedValue) {
    // if (scope.beforeSelectItem && typeof (scope.beforeSelectItem) == 'function')
    //   scope.beforeSelectItem(selectedValue);

    this.modelArr.push(selectedValue);
    this.modelChange.emit(this.modelArr);

    // if (scope.afterSelectItem && typeof (scope.afterSelectItem) == 'function')
    //   scope.afterSelectItem(selectedValue);

    this.inputValue = '';
    this.filterValues('');

    if (this.suggestionsArr.length === this.modelArr.length) {
      this.isHover = false;
    }
  }

  isDuplicate(arr, item) {
    let duplicate = false;
    if (arr == null || arr === '') {
      return duplicate;
    }

    for (let i = 0; i < arr.length; i++) {
      duplicate = _.isEqual(arr[i], item);
      duplicate = arr[i] === item;
      if (duplicate) {
        break;
      }
    }
    return duplicate;
  }

  removeAddedValues(item) {
    if (this.modelArr != null) {
      const itemIndex = this.modelArr.indexOf(item);
      if (itemIndex !== -1) {
        // if (scope.beforeRemoveItem && typeof (scope.beforeRemoveItem) == 'function')
        //   scope.beforeRemoveItem(item);

        this.modelArr.splice(itemIndex, 1);
        this.modelChange.emit(this.modelArr);
        this.filterValues('');

        // if (scope.afterRemoveItem && typeof (scope.afterRemoveItem) == 'function')
        //   scope.afterRemoveItem(item);
      }
    }
  }

  mouseEnterOnItem(index) {
    this.selectedItemIndex = index;
  }

  isEmailSelected(selection) {
    const isSelected = this.utilitiesService.findKeyValue(this.modelArr, 'email', selection.email);
    return isSelected !== -1;
  }

  allEmailsSelected() {
    let selectedEmails = 0;
    this.suggestionsArrFiltered.forEach(element => {
      if (this.isEmailSelected(element)) {
        selectedEmails++;
      }
    });
    return this.suggestionsArrFiltered.length === selectedEmails;
  }

}
