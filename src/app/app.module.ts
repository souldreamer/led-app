import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { ProgramsPageComponent } from '../pages/programs-page/programs-page';
import { SettingsPageComponent } from '../pages/settings-page/settings-page';
import { ProgramsListComponent } from '../components/programs-list/programs-list.component';
import { LedServerService } from '../services/led-server.service';

import { HttpMock } from '../dev-mocks/Http.mock';

@NgModule({
	declarations: [
		MyApp,
		ProgramsPageComponent,
		SettingsPageComponent,
		ProgramsListComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot({
			name: 'ledApp',
			driverOrder: ['sqlite', 'indexeddb', 'websql']
		})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		ProgramsPageComponent,
		SettingsPageComponent
	],
	providers: [
		StatusBar,
		SplashScreen,
		LedServerService,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
//		{ provide: Http, useClass: HttpMock }
	]
})
export class AppModule {
}
