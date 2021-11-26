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

  public showAddForm = false;
  public files: any[] = [];

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
    this.showAddForm = false;

  }

  onAddNewClick(event: MatOptionSelectionChange) {
    console.log("!! | onAddNewClick | event", event)
    this.showAddForm = true;
  }



  onFileDropped($event:any) {
    this.prepareFilesList($event);
  }


  fileBrowseHandler(files?:any) {
    if (!files.target?.files) {
      return;
    } 
    this.prepareFilesList(files.target?.files);
  }


  deleteFile(index: number) {
    this.files.splice(index, 1);
  }


  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }

  formatBytes(bytes:any, decimals:any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
