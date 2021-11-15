import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListSelectorOption } from '../models/list-selector.model';

@Component({
  selector: 'ss-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.scss']
})
export class ListSelectorComponent implements OnInit {

  @Input() set optionsList(value: ListSelectorOption[] | null) {
    this.innerOptionsList = value;
  }

  @Output() selectedOption = new EventEmitter<ListSelectorOption>();

  public get optionsList(): ListSelectorOption[] | null {
    return this.innerOptionsList;
  }

  public currentOption: ListSelectorOption | null = null;


  private innerOptionsList: ListSelectorOption[] | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  public onOptionClicked(event: ListSelectorOption) {
    this.currentOption = event;
    this.selectedOption.emit(event);
  }

}
