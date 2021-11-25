import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainStateService } from '../services/main-state.service';
import { UserService } from '../../core/common/services/user.service';
import { ListSelectorOption } from 'src/app/secondary-module/models/list-selector.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from "@angular/material/select";
import { MatOptionSelectionChange } from "@angular/material/core";

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

  isEditable = false;
  public step: ParamsSetupStep = ParamsSetupStep.step1;
  public baseTypes = [{ name: "ТСН МГЭ", isAvailable: true }, { name: "ФЕР", isAvailable: false },]
  public availableBaseOptions = [{ name: "Дополнение 55" }, { name: "Дополнение 56" },]

  constructor(private router: Router, private stateService: MainStateService,
    private userService: UserService,) {

  }

  ngOnInit(): void {

  }

  onNewClick() {
    this.router.navigateByUrl("/");
  }

  handleOptionClick(option: ListSelectorOption) {

  }

  onSelectionChange(event: MatSelectChange) {
    console.log("!! | onSelectionChange | event", event)

  }

  onAddNewClick(event: MatOptionSelectionChange) {
    console.log("!! | onAddNewClick | event", event)

  }

}
