import { Component, Input, OnInit } from '@angular/core';
import { TailwindColorType }        from '../../types/lib-types';

@Component({
  selector: 'app-map-tooltip-info-line',
  templateUrl: './map-tooltip-info-line.component.html',
  styleUrls: ['./map-tooltip-info-line.component.scss']
})
export class MapTooltipInfoLineComponent implements OnInit {

	@Input() value: string = '';
	@Input() title: string = '';
	@Input() icon: string = '';
	@Input() titleBold: boolean = false;
	@Input() valueBold: boolean = false;
	@Input() iconColor: TailwindColorType | undefined = undefined;
	@Input() textColor: TailwindColorType | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
