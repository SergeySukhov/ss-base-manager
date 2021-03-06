import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainStateService } from './services/main-state.service';
import { UserService } from '../../core/services/user-services/user.service';
import { TreeSelectorOption } from 'src/app/secondary-module/models/list-selector.model';
import { ManagerContext } from 'src/app/shared/models/common/enums';
import { AuthViewService } from "src/app/auth.module/auth/services/auth.view.service";
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { NotificationService } from 'src/app/core/services/notification.service';
import { InstructionPdf, ProjectDocs, TFSRepo } from "src/app/shared/models/common/consts";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: []
})
export class MainComponent implements OnInit {

  public ManagerContext = ManagerContext;
  public contextOptions: TreeSelectorOption[] = [{
    name: "Добавление микросервиса базы",
    available: true,
    expandable: true,
    level: 0,
    action: () => { },
    children: [{
      name: "Нормативные базы",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.setContext(ManagerContext.normbase)
      }
    }, {
      name: "Базы формул",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.setContext(ManagerContext.formula)
      },
    }, {
      name: "Базы индексов",
      available: false,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.setContext(ManagerContext.indexes)
      }
    }, {
      name: "Множественная загрузка",
      available: false,
      level: 1,
      expandable: false,
      action: () => {
        this.stateService.setContext(ManagerContext.multipleUploader)
      }
    },]

  }, {
    name: "Управление доступными базами",
    available: true,
    level: 0,
    expandable: false,
    action: () => {
      this.stateService.setContext(ManagerContext.manager)
    }
  }, {
    name: "Мониторинг и логи",
    available: false,
    level: 0,
    expandable: false,
    action: () => {
      this.stateService.context = ManagerContext.logs;
    }
  }, {
    name: "Документация",
    available: true,
    expandable: true,
    level: 0,
    action: () => { },
    children: [{
      name: "Инструкция",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        window.open(InstructionPdf);
      }
    }, {
      name: "Репозиторий",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        window.open(TFSRepo);
      }
    }, {
      name: "Вся документация",
      available: true,
      level: 1,
      expandable: false,
      action: () => {
        window.open(ProjectDocs);
      }
    },]
  }
  ]

  constructor(public stateService: MainStateService,
    private userService: UserService, private authService: AuthViewService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.stateService.tooltipUserImageSrc = this.userService.vipUserImgSrc;
    this.userService.userChange.subscribe(name => {
      this.stateService.tooltipUserImageSrc = this.userService.vipUserImgSrc;
    });
    this.stateService.context = this.userService.lastContext;
    this.notificationService.initNotifications();
  }

  toStart() {
    this.stateService.setContext(ManagerContext.start);
  }

  onLogout() {
    this.stateService.setContext(ManagerContext.start);
    this.authService.logout();
    this.userService.onLogout();
  }

}
