import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { CurrencyPipe, DecimalPipe, LowerCasePipe } from '@angular/common';
import * as moment from 'moment';
import { HeaderService } from './header.service';
declare var $: any;

@Injectable()
export class UtilitiesService {

  custName = '';
  userInfo: any;
  globalCustView: string;
  lineHeaderDetails: any;
  qualification: any;
  activeTemp: string;
  pipelineDetails: any;
  writebackDone = false;
  currentShareActive = { index: -1, action: '' };
  enableStartQual: boolean;
  enableShare: boolean;

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private lowerCasePipe: LowerCasePipe,
    public headerService: HeaderService
  ) {
    this.globalCustView = 'N';
    this.pipelineDetails = '';
  }
  setWritebackDone(value) {
    this.writebackDone = value;
  }

  getWritebackDone() {
    return this.writebackDone;
  }

  // used in main-header service for initial calls
  getOptions () {
    const options = new RequestOptions({ withCredentials: true });
    return options;
  }

  lowerCaseText(value) {
    return this.lowerCasePipe.transform(value);
  }

  formatValue(value) {
    return this.currencyPipe.transform(value, 'USD', 'symbol');
  }

  formatNumber(value) {
    return this.decimalPipe.transform(value);
  }

  setPipelineDetails(pipelineDetails) {
    this.pipelineDetails = pipelineDetails;
  }

  getPipelineDetails() {
    return this.pipelineDetails;
  }

  setCustomerName(customerName) {
    this.custName = decodeURIComponent(customerName);
  }

  getCustomerName() {
    return this.custName;
  }

  setUserInformation(user) {
    this.userInfo = user;
  }

  getUserInformation() {
    return this.userInfo;
  }

  setGlobalCustomerView(globalView) {
    this.globalCustView = globalView ? 'Y' : 'N';
  }

  getGlobalCustomerView() {
    return this.globalCustView;
  }

  setLineHeaderDetails (lineData) {
    this.lineHeaderDetails = lineData;
  }

  getLineHeaderDetails() {
    return this.lineHeaderDetails;
  }

  // Format Date (ex: 01-Jan-2018)
  getFormattedDate(params) {
    if (params) {
      return moment(params).format('D-MMM-YYYY');
    }
  }

  // save current qualification
  setQualification(q) {
    this.qualification = q;
  }

  getQualification() {
    return this.qualification;
  }

  // All four for retaining templates on navigation between qualifications all below 4 methods
  setActiveTemp(temp) {
    this.activeTemp = temp;
  }

  getActiveTemp() {
    this.activeTemp = (this.activeTemp === undefined) ? 'Default Template' : this.activeTemp;
    return this.activeTemp;
  }

  onCellMouseOver(params) {
    if (params.data.action === 'Start Qualification') {
      this.enableStartQual = true;
      this.enableShare = false;
    } else {
      this.enableStartQual = false;
      this.enableShare = true;
    }
    this.currentShareActive.index = params.rowIndex;
    const winHeight = window.innerHeight;
    const element = $(params.event.target).closest('.ag-cell');
    const elementOffset = element.offset();
    const elementWidth = element.outerWidth();
    const elementHeight = element.outerHeight();
    let tooltipHeight;
    let tooltipWidth;
    let tooltipLeft;
    let tooltipTop;

    if (element.find('.tooltip-qualified').length) {
      tooltipHeight = $('.outer-box').outerHeight();
      tooltipLeft = elementOffset.left + elementWidth + 20;
      tooltipTop = elementOffset.top - (tooltipHeight / 2);
      if (tooltipTop + tooltipHeight > winHeight) {
        tooltipTop -= (tooltipTop + tooltipHeight + 20) - winHeight;
      }
      this.headerService.updateOppPercent(params);
      $('.outer-box').css({
        left: tooltipLeft,
        top: tooltipTop
      });
    } else {
      $('.outer-box').css({
        left: '',
        top: ''
      });
    }

    if (element.find('.shareDiv').length) {
      tooltipHeight = $('.app-shareDiv').outerHeight();
      tooltipWidth = $('.app-shareDiv').outerWidth();
      tooltipLeft = elementOffset.left - tooltipWidth;
      tooltipTop = elementOffset.top - ((tooltipHeight - elementHeight) / 2);
      $('.app-shareDiv').css({
        left: tooltipLeft,
        top: tooltipTop
      });
    } else {
      $('.app-shareDiv').css({
        left: '',
        top: ''
      });
    }

  }

  onCellMouseOut(e) {
    $('.outer-box').css({
      left: '',
      top: ''
    });
    if (!$(e.event.toElement).closest('.app-action-dropdown').length) {
      $('.app-shareDiv').css({
        left: '',
        top: ''
      });
    }
  }

  share(c, action) {
    this.currentShareActive.action = action;
    $('.ag-body-container .ag-row[row-index="' + this.currentShareActive.index + '"]').find('.' + c).closest('.ag-cell').trigger('click');
    setTimeout(() => {
      this.currentShareActive.action = '';
      $('.app-shareDiv').css({
        left: '',
        top: ''
      });
    }, 0);
  }

  bindHeaderMouseOver() {
    $('body').off('mouseover', '.ico-info').on('mouseover', '.ico-info', function () {
      const element = $(this).closest('.ag-header-cell');
      if (!element) {
        return;
      }
      const infoElementOffset = $(this).offset();
      const elementContainerOffset = $(this).closest('.ag-header-container').offset();
      const tooltipWidth = element.find('.ico-infoText').outerWidth();
      const tooltipHeight = element.find('.ico-infoText').outerHeight();
      let tooltipLeft = infoElementOffset.left - (tooltipWidth / 2) + 8;
      let iconLeft;
      if (tooltipLeft <= 5) {
        tooltipLeft = 5;
        iconLeft = infoElementOffset.left - 5;
      } else {
        iconLeft = '';
      }
      const tooltipTop = elementContainerOffset.top - tooltipHeight - 2;
      element.find('.ico-infoText').css({
        left: tooltipLeft,
        top: tooltipTop
      });
      element.find('.icon-arrow-up').css({
        left: iconLeft
      });
    });
  }

  findKeyValue(items: any[], key, value: string): any {
    let f = -1;
    items.forEach(function (o, ind) {
      if (o[key] === value) {
        f = ind;
        return false;
      }
    });
    return f;
  }

  setTableHeight() {
    setTimeout(function () {
      const element = document.getElementById('ag-grid');
      const winHeight = window.innerHeight;
      const header = document.getElementById('header').offsetHeight;
      const breadcrumb = document.getElementById('breadcrumbWrapper');
      const breadcrumbHeight = breadcrumb ? breadcrumb.offsetHeight : 0;
      const subheader = document.getElementById('subHeaderWrap');
      const subheaderHeight = subheader ? subheader.offsetHeight : 0;
      const approve = document.getElementById('approve-disapprove');
      const approveHeight = approve ? 10 : 0;
      const actions = document.getElementById('actions-container');
      const actionsHeight = actions ? actions.offsetHeight : 0;
      const pageContent = document.getElementById('page-header');
      const pageContentHeight = pageContent ? pageContent.offsetHeight : 0;
      const pagination = document.getElementsByClassName('ag-paging-panel') as HTMLCollectionOf<HTMLElement>;
      let paginationHeight = 0;
      if (pagination.length) {
        paginationHeight = pagination[0].offsetHeight;
      }
      const margin = 8;
      const tableHeight = winHeight - (header + breadcrumbHeight + subheaderHeight + approveHeight + actionsHeight + pageContentHeight + paginationHeight + margin);
      element.style.height = tableHeight + 'px';
    }, 500);
  }

  getScrollBarWidth() {
    const inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.className = 'dummyScroll';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    const w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let w2 = inner.offsetWidth;

    if (w1 === w2) {
      w2 = outer.clientWidth;
    }

    document.body.removeChild(outer);

    return (w1 - w2);
  }

  adjustTabsHeight(qualid) {
    const scrollWidth = this.getScrollBarWidth();
    const thisInstance = this;
    setTimeout(function () {
      const element = $('.gridFixedTabs');
      let width = 0;
      $('.gridFixedTabs li').each(function () {
        width += $(this).outerWidth();
      });
      const hasScroll = width > 700;
      $('.ag-paging-panel').css({
        height: ''
      });
      $('.gridFixedTabs ul').css({
        width: width + 2
      });
      if (hasScroll) {
        $('.ag-paging-panel').css({
          height: $('.ag-paging-panel').height() + scrollWidth + 2
        });
        if (qualid) {
          $('.gridFixedTabs').animate({
            scrollLeft: $('.gridFixedTabs li[qualid="' + qualid + '"]').position().left
          }, 'slow');
        }
      }
      thisInstance.setTableHeight();
      // thisInstance.addRemoveTabsShadow();
    });
  }

  addRemoveTabsShadow() {
    $(function () {
      $('.gridFixedTabs').scroll(function () {
        const isLeft = $(this).scrollLeft() === 0;
        const isRight = $(this).scrollLeft() >= $(this).get(0).scrollWidth - $(this).outerWidth();
        if (isLeft) {
          $('.gridFixedTabs').addClass('tab-shadow-right').removeClass('tab-shadow-left');
        } else if (isRight) {
          $('.gridFixedTabs').addClass('tab-shadow-left').removeClass('tab-shadow-right');
        } else {
          $('.gridFixedTabs').addClass('tab-shadow-left tab-shadow-right');
        }
      }).scroll();
    });
  }

  addRemoveFiltersShadow() {
    $(function () {
      $('.sidebar-opt-content').scroll(function () {
        const isTop = $(this).scrollTop() === 0;
        const isBottom = $(this).scrollTop() >= $(this).get(0).scrollHeight - $(this).outerHeight();
        if (isTop) {
          $('#sidebar-container .fixed-bottom').addClass('filter-shadow-bottom');
          $('#sidebar-container .sidebar-header').removeClass('filter-shadow-top');
        } else if (isBottom) {
          $('#sidebar-container .sidebar-header').addClass('filter-shadow-top');
          $('#sidebar-container .fixed-bottom').removeClass('filter-shadow-bottom');
        } else {
          $('#sidebar-container .fixed-bottom').addClass('filter-shadow-bottom');
          $('#sidebar-container .sidebar-header').addClass('filter-shadow-top');
        }

      }).scroll();
    });
  }

  getDateTime() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date();
    return d.getDate() + monthNames[d.getMonth()] + d.getFullYear() + '_' + d.getHours() + d.getMinutes() + d.getSeconds();
  }

  positionQualEdit() {
    setTimeout(() => {
      const dropdown = $('.bottom-dropdown.active');
      if (!dropdown.length) {
        return;
      }
      const dropdown_width = dropdown.outerWidth();
      const li = dropdown.closest('li');
      const li_pos = li.offset();
      const li_width = li.outerWidth();
      dropdown.css({
        left: li_pos.left + li_width - dropdown_width,
      });
    }, 0);
  }

  sumByKey(data, key) {
    let sum = 0;
    for (const itr in data) {
      if (data.hasOwnProperty(itr)) {
        sum += parseInt(data[itr][key], 10);
      }
    }
    return sum;
  }

}
