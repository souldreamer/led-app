import { Component, AfterViewInit } from '@angular/core';
import { LedServerService } from '../../services/led-server.service';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'led-programs-list',
	templateUrl: 'programs-list.component.html'
})
export class ProgramsListComponent implements AfterViewInit {
	server$: ReplaySubject<string>;
	programs$: ReplaySubject<string[]>;

	constructor(
	    private ledServerService: LedServerService
	) {
		this.server$ = this.ledServerService.server$;
		this.programs$ = this.ledServerService.programs$;
	}

	ngAfterViewInit() {
	}
	
	startProgram(program: string) {
		this.ledServerService.startProgram(program).subscribe(
			next => {},
			err => {},
			() => {}
		);
	}
}
