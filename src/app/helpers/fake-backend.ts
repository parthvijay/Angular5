import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { LoaderService } from '../shared/loader/loader.service';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend, loaderService: LoaderService) {

    backend.connections.subscribe((connection: MockConnection) => {
        const realHttp = new Http(realBackend, options);
        let requestOptions = new RequestOptions();
        let reqURL;

        if (connection.request.url.endsWith('/user') && connection.request.method === RequestMethod.Get) {
            reqURL = 'assets/data/main-header/user.json';
        } else if (connection.request.url.endsWith('/summaryView') && connection.request.method === RequestMethod.Post) {
            if (connection.request.getBody().indexOf('"Y"') > -1) {
                reqURL = 'assets/data/summary/summary_non_savm.json';
            } else {
                reqURL = 'assets/data/summary/summary.json';
            }
        } else if (connection.request.url.endsWith('/summaryView/global') && connection.request.method === RequestMethod.Get) {
            reqURL = 'assets/data/summary/summary_global.json';
        } else if (connection.request.url.endsWith('/taskCount') && connection.request.method === RequestMethod.Get) {
            reqURL = 'assets/data/summary/task.json';
        } else if (connection.request.url.endsWith('/bookmarks?bookmarkType=favorite&limit=5') && connection.request.method === RequestMethod.Get) {
            reqURL = 'assets/data/main-header/bookmarks.json';
        } else if (connection.request.url.endsWith('/qual/details') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/intermediate-summary.json';
        } else if (connection.request.url.endsWith('/qual/custDetails') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/line-level/line-level.json';
        } else if (connection.request.url.endsWith('/qual/lineDetails') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/line-level/line-level.json';
        } else if (connection.request.url.endsWith('/qual/qualList') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/line-level/line-level-qualifications.json';
        } else if (connection.request.url.endsWith('/qual/saveQualificationTask') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/summary/save-task.json';
        } else if (connection.request.url.endsWith('/qual/header') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/sub-header/sub-header.json';
        } else if (connection.request.url.endsWith('/qual/lineHeader') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/sub-header/sub-header.json';
        } else if (connection.request.url.endsWith('/qual/custHeader') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/sub-header/sub-header.json';
        } else if (connection.request.url.indexOf('/qual/searchUser') > -1 && connection.request.method === RequestMethod.Get) {
            reqURL = 'assets/data/users.json';
        } else if (connection.request.url.endsWith('/qual/shareQual') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/share-email.json';
        } else if (connection.request.url.endsWith('/qual/shareLineLevel') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/share-email.json';
        } else if (connection.request.url.endsWith('/qual/notifyAM') && connection.request.method === RequestMethod.Post) {
            reqURL = 'assets/data/notify-am.json';
        } else {
            requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            reqURL = connection.request.url;
        }

        loaderService.show();
        realHttp.request(reqURL, requestOptions)
            .subscribe((response: Response) => {
                connection.mockRespond(response);
                loaderService.hide();
            },
            (error: any) => {
                connection.mockError(error);
            });
    });

    return new Http(backend, options);
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend, LoaderService]
};
