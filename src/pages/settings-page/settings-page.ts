import { Component } from '@angular/core';

import { NavController, NavParams, PickerColumn } from 'ionic-angular';

@Component({
	selector: 'page-page2',
	templateUrl: 'settings-page.html'
})
export class SettingsPageComponent {
	selectedItem: any;
	icons: string[];
	items: Array<{ title: string, note: string, icon: string }>;
	
	colOptions: PickerColumn = {
		name: 'A',
		suffix: 'n',
		columnWidth: '50px',
		selectedIndex: 1,
		options: [
			{text: '-1', value: -1},
			{text: '0', value: 0},
			{text: '1', value: 1}
		]
	};
	
	colOptions2: PickerColumn = {
		name: 'B',
		prefix: '+',
		columnWidth: '50px',
		selectedIndex: 1,
		options: [
			{text: '-1', value: -1},
			{text: '0', value: 0},
			{text: '1', value: 1}
		]
	};

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		// If we navigated to this page, we will have an item available as a nav param
		this.selectedItem = navParams.get('item');

		// Let's populate this page with some filler content for funzies
		this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
			'american-football', 'boat', 'bluetooth', 'build'];

		this.items = [];
		for (let i = 1; i < 11; i++) {
			this.items.push({
				title: 'Item ' + i,
				note: 'This is item #' + i,
				icon: this.icons[Math.floor(Math.random() * this.icons.length)]
			});
		}
	}

	itemTapped(event, item) {
		// That's right, we're pushing to ourselves!
		this.navCtrl.push(SettingsPageComponent, {
			item: item
		});
	}
}
