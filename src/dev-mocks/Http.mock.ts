import { Observable } from 'rxjs';
import 'rxjs/add/operator/delay';
import * as XRegExp from 'xregexp';

const MockPrograms = ['red-green', 'red-green-fade', 'random', 'move-led'];

class ResponseObject {
	constructor(private responseObject: any) {}
	json() { return this.responseObject; }
	text() { return JSON.stringify(this.responseObject); }
}

export class HttpMock {
	urlMatcher = XRegExp(String.raw`^
		(?<protocol>https?):\/\/
		(?<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})
		(:(?<port>\d{1,5}))?\/
		(?<path>.*)
	$`, 'x');

	get(url: string) {
		const urlParts = XRegExp.exec(url, this.urlMatcher);
		console.log({url, urlParts, ip: urlParts['ip']});
		switch (urlParts['ip']) {
		case '192.168.1.239':
			// Raspberry PI
			return HttpMock.getRasPiResponse(urlParts['path']).delay(200);
		case '192.168.1.0':
		case '192.168.1.1':
		case '192.168.1.2':
		case '192.168.1.44':
		case '192.168.1.102':
			// Routers & other computers on network
			return Observable.throw(new ResponseObject(404)).delay(150);
		default:
			return Observable.throw(new ResponseObject('timeout')).delay(30000);
		}
	}

	private static getRasPiResponse(path: string): Observable<ResponseObject> {
		console.warn('RasPI response', path);
		switch (path) {
		case 'ping':
			return Observable.of(new ResponseObject(''));
		case 'programs':
			return Observable.of(new ResponseObject(MockPrograms));
		default:
			return Observable.throw(new ResponseObject(404));
		}
	}
}
