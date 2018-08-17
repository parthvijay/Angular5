import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {

  constructor() { }
  fullScreen = false;
  oppPercent = { disqualified: 0, qualified: 0, pending: 0, total: 0, disqualPercent: 0, qualPercent: 0, pendingPercent: 0 };
  fullScreenView() {
    this.fullScreen = true;
  }

  exitFullScreenView() {
    this.fullScreen = false;
  }

  updateOppPercent(params) {
    let disqualified = params.data.ibOpportunityPercentage.disqualified;
    let qualified = params.data.ibOpportunityPercentage.qualified;
    let pending = params.data.ibOpportunityPercentage.pending;
    disqualified = disqualified ? parseFloat(disqualified) : 0;
    qualified = qualified ? parseFloat(qualified) : 0;
    pending = pending ? parseFloat(pending) : 0;
    // tslint:disable-next-line:radix
    const total = (parseFloat(disqualified) + parseFloat(qualified) + parseFloat(pending));
    let disqualPercent = parseFloat(((disqualified / total) * 100).toFixed(2));
    let qualPercent = parseFloat(((qualified / total) * 100).toFixed(2));
    let pendingPercent = parseFloat(((pending / total) * 100).toFixed(2));

    disqualPercent = !isNaN(disqualPercent) ? disqualPercent : 0;
    qualPercent = !isNaN(qualPercent) ? qualPercent : 0;
    pendingPercent = !isNaN(pendingPercent) ? pendingPercent : 0;

    this.oppPercent = { disqualified: disqualified, qualified: qualified, pending: pending, total: total, disqualPercent: disqualPercent, qualPercent: qualPercent, pendingPercent: pendingPercent };
    return this.oppPercent;
  }

}
