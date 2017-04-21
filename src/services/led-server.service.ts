import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/timeoutWith';
import { ToastController } from 'ionic-angular';

@Injectable()
export class LedServerService {
	public server$ = new ReplaySubject<string>(1);
	public server = '';
	public serverFound = false;
	public serverFound$ = new ReplaySubject<boolean>(1);
	public programs$ = new ReplaySubject<string[]>(1);
	public program$ = new ReplaySubject<string>(1);

	constructor(
		private http: Http,
		private storage: Storage,
		private toastController: ToastController
	) {
		this.findServer();
		this.server$.subscribe(address => {
			this.serverFound = true;
			this.serverFound$.next(true);
			this.server = address;
			this.storage.ready().then(() => this.storage.set('server-address', address));
		}, () => {
			this.showShortMessage(`Couldn't find RasPI, retrying in a second`);
			setTimeout(() => this.findServer(), 1000);
		});
	}

	async findServer() {
		this.serverFound = false;
		this.serverFound$.next(false);
		
		const timeout = 1000;
		const numSimultaneousRequests = 130;
		const addresses = new Array(256).fill(0, 0, 256).map((_, index) => `http://192.168.1.${index}:8080/ping`);
		
		await this.storage.ready();
		const lastServerAddress: string|undefined = await this.storage.get('server-address');
		if (lastServerAddress != null) {
			this.showShortMessage(`Last server address was ${lastServerAddress}`);
			addresses.unshift(`${lastServerAddress}/ping`);
		}
		
		Observable
			.from(addresses)
			.bufferCount(numSimultaneousRequests)
			.concatMap((batch, index) => Observable.from(batch).delay(index * timeout))
			.mergeMap(address => this
				.http.get(address)
				.timeoutWith(timeout, Observable.throw({}))
				.mapTo(address)
				.catch(_ => Observable.empty())
			)
			.first()
			.map((address: string) => address.substring(0, address.length - 5))
			.catch(_ => Observable.empty())
			.subscribe(this.server$);
		
		this.server$
			.switchMap(server => this.http.get(`${server}/programs`).map(res => res.json()).catch(error => Observable.empty()))
			.subscribe(this.programs$);
	}
	
	startProgram(program: string) {
		this.program$.next(program);
		return this
			.program$
			.combineLatest(this.server$, (program, server) => `${server}/programs/${program}/active`)
			.switchMap(address => this.http.get(address))
			.first()
			.do(() => {
				this.showShortMessage(`Program '${program}' started`);
			});
	}
	
	showShortMessage(message: string) {
		const toast = this.toastController.create({
			message,
			duration: 1000,
			position: 'bottom'
		});
		toast.present();
	}
}
