import { Component } from '@angular/core';
import { FiltersService } from './filters/filters.service';
import { HeaderService } from './shared/services/header.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UtilitiesService } from './shared/services/utilities.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html'
})

export class AppComponent {

    constructor(public filtersService: FiltersService,
        public headerService: HeaderService,
        public rout: Router,
        private cookieService: CookieService,
        public utilitiesService: UtilitiesService
    ) {
        const value: string = cookieService.get('anchorvalue');
        const url = value.slice(1);
        if (window.location.hash === '') {
            this.rout.navigate([url]);
        }
    }
}
