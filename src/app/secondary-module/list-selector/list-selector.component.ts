import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListSelectorOption } from '../models/list-selector.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',

  },
  {
    name: 'Vegetables',

  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

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

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  public get optionsList(): ListSelectorOption[] | null {
    return this.innerOptionsList;
  }
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  public currentOption: ListSelectorOption | null = null;


  private innerOptionsList: ListSelectorOption[] | null = null;

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
  }

  public onOptionClicked(event: ListSelectorOption) {
    this.currentOption = event;
    this.selectedOption.emit(event);
  }

}
