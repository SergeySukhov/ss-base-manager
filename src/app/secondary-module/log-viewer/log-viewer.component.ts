import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ss-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss']
})
export class LogViewerComponent implements OnInit {

  @Input() logs: string[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
