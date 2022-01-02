import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeSelectorOption } from '../models/list-selector.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

@Component({
  selector: 'ss-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.scss']
})
export class ListSelectorComponent implements OnInit {

  @Input() set optionsList(value: TreeSelectorOption[] | null) {
    if (value) {
      this.dataSource.data = value;
    }
  }

  @Output() selectedOption = new EventEmitter<TreeSelectorOption>();

  hasChild = (_: number, node: TreeSelectorOption) => node.expandable;

  treeTransformer = (node: TreeSelectorOption, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      action: node.action,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this.treeTransformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  treeControl = new FlatTreeControl<TreeSelectorOption>(
    node => node.level,
    node => node.expandable,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  public currentOption: TreeSelectorOption | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  test(event: any) {
    console.log("!! | test | event", event)

  }

  public onOptionClicked(event: TreeSelectorOption) {
    this.currentOption = event;
    this.selectedOption.emit(event);
  }

}
