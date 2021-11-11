import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainStateService } from '../services/main-state.service';
import { UserService } from '../../core/common/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private stateService: MainStateService, private userService: UserService) { }

  ngOnInit(): void {
  }

  onNewClick() {
    this.router.navigateByUrl("/");
  }

}
