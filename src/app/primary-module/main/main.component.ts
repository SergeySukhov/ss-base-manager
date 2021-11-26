import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainStateService } from '../services/main-state.service';
import { UserService } from '../../core/common/services/user.service';
import { ListSelectorOption } from 'src/app/secondary-module/models/list-selector.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from "@angular/material/select";
import { MatOptionSelectionChange } from "@angular/material/core";
import { ThemeService } from "../services/theme.service";

enum ParamsSetupStep {
  step1 = "step1",
  step2 = "step2",
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  isDarkMode: boolean = true;
  showFiller = false;

  constructor(private router: Router, private stateService: MainStateService,
    private userService: UserService, private themeService: ThemeService,) {

  }

  ngOnInit(): void {

  }

  onNewClick() {
    this.router.navigateByUrl("/");
  }

  handleOptionClick(option: ListSelectorOption) {

  }

  toggleDarkMode() {
    this.isDarkMode = this.themeService.isDarkMode();

    this.isDarkMode
      ? this.themeService.update('light-mode')
      : this.themeService.update('dark-mode');
  }


}
