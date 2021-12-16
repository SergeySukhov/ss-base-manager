import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'ss-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() title = "";
  @Input() hideBackArrow = true;
  @Output() backArrowEvent = new EventEmitter();
  public isDarkMode = true;
  
  constructor(public themeService: ThemeService,) { }

  ngOnInit(): void {
    this.isDarkMode = !this.themeService.isDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.update(this.isDarkMode ? 'light-mode' : 'dark-mode')
  }

  onBack() {
    this.backArrowEvent.emit();
  }
}
