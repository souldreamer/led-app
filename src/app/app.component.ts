import { Component, ViewChild } from '@angular/core';
import { LoadingController, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProgramsPageComponent } from '../pages/programs-page/programs-page';
import { SettingsPageComponent } from '../pages/settings-page/settings-page';
import { LedServerService } from '../services/led-server.service';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = ProgramsPageComponent;

	pages: Array<{ title: string, component: any, icon?: string }>;

	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		private loadingController: LoadingController,
	    private toastController: ToastController,
	    private ledServerService: LedServerService
	) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Programs', component: ProgramsPageComponent, icon: 'list-box' },
			{ title: 'Settings', component: SettingsPageComponent, icon: 'settings' }
		];
		console.log('App initialized');
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
		this.initLoadingMessages();
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	initLoadingMessages() {
		let findLedLoader = this.loadingController.create({
			content: 'Finding LED Server'
		});
		let serverStatusToast = this.toastController.create({
			message: 'Server status',
			duration: 3000,
			position: 'bottom'
		});

		this.ledServerService.serverFound$
			.subscribe(found => {
				if (found) {
					findLedLoader.dismiss();
				}
				if (!found) {
					findLedLoader.present();
				}
			});
		this.ledServerService.server$
			.subscribe(server => {
				serverStatusToast.setMessage(`Server found at ${server}`);
				serverStatusToast.present();
			}, () => {
				serverStatusToast.setMessage(`Server not found on local network. Retrying...`);
				serverStatusToast.present();
			});
	}
}
