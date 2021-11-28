import { Component, OnInit } from '@angular/core';
import { MainStateService } from '../main/services/main-state.service';

@Component({
  selector: 'ss-normative-base',
  templateUrl: './normative-base.component.html',
  styleUrls: ['./normative-base.component.scss']
})
export class NormativeBaseComponent implements OnInit {

  constructor(public stateService: MainStateService,) {

  }

  ngOnInit(): void {

  }
}
