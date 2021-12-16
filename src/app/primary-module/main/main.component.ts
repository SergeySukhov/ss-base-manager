import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainStateService } from './services/main-state.service';
import { UserService } from '../../core/common/services/user.service';
import { ListSelectorOption } from 'src/app/secondary-module/models/list-selector.model';
import { ThemeService } from "../../secondary-module/toolbar/services/theme.service";
import { ManagerContext } from '../models/common-enums';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public ManagerContext = ManagerContext;
  public menuOptions: ListSelectorOption[] = [{
    title: "Нормативные базы",
    available: true,
    action: () => {
      this.stateService.context = ManagerContext.base;
    }
  }, {
    title: "Базы индексов",
  }, {
    title: "Базы поправок",
    available: false,
  }, {
    title: "Базы формул",
    available: false,
  }, {
    title: "",
    isDivider: true,
  }, {
    title: "Конфигурация Minio",
    available: true,
  }
  ]
  constructor(public stateService: MainStateService,
    private userService: UserService,) {
  }

  ngOnInit(): void {

  }

  toStart() {
    this.stateService.context = ManagerContext.start;
  }



}
