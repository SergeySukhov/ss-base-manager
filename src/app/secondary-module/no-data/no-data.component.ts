import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ss-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  @Input() set errorMessage(value: string) {
    this.pErrorMessage = value;
  }

  @Input() needReloadButton = false;

  @Output() reload = new EventEmitter();

  get errorMessage(): string {
    return this.pErrorMessage;
  }

  private pErrorMessage = "";

  constructor() { }

  ngOnInit(): void {
  }

  tryReload() {
    this.reload.emit();
  }

}
