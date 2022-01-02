import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainStateService } from './services/main-state.service';
import { UserService } from '../../core/services/user.service';
import { TreeSelectorOption } from 'src/app/secondary-module/models/list-selector.model';
import { ManagerContext } from 'src/app/shared/models/common/enums';
import { AuthViewService } from "src/app/auth.module/auth/services/auth.view.service";


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public ManagerContext = ManagerContext;
  public contextOptions: TreeSelectorOption[] = [{
    name: "Добавление микросервиса базы",
    available: true,
    expandable: true,
    level: 0,
    action: () => {},
    children: [{
      name: "Нормативные базы",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.context = ManagerContext.base;
      }
    }, {
      name: "Базы формул",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.context = ManagerContext.formula;
      },
    }, {
      name: "Базы индексов",
      available: false,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.context = ManagerContext.indexes;
      }
    }, {
      name: "Базы поправок",
      available: false,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.context = ManagerContext.correction;
      }
    },]

  }, {
    name: "Управление доступными базами",
    available: true,
    level: 0,
    expandable: false,
    action: () => {
      this.stateService.context = ManagerContext.manager;
    }
  }, {
    name: "Шаблоны добавления",
    available: false,
    level: 0,
    expandable: false,
    action: () => {
      // this.stateService.context = ManagerContext.manager;
    }
  },
  ]

  constructor(public stateService: MainStateService,
    private userService: UserService, private authService: AuthViewService) {
  }



  ngOnInit(): void {
    this.stateService.tooltipUserImageSrc = this.userService.vipUserImgSrc;
    this.userService.userChange.subscribe(name => {
      this.stateService.tooltipUserImageSrc = this.userService.vipUserImgSrc;
    });
  }

  toStart() {
    this.stateService.context = ManagerContext.start;
  }

  onLogout() {
    this.authService.logout();
  }

}
