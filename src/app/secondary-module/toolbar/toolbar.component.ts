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
  @Input() hideUser = true;
  @Input() hideNotes = true;
  @Input() set muscleType(value: "0" | "1" | "2") {
    this.pMuscleType = value;
    this.muscleSrc = this.muscleSrcMap.find(x => x.type === value)?.src ?? "";
  }
  get muscleType() {
    return this.pMuscleType;
  }
  pMuscleType:  "0" | "1" | "2" = "0"
  @Output() backArrowEvent = new EventEmitter();
  @Output() logoutEvent = new EventEmitter();
  public isDarkMode = true;

  public muscleSrc: string = "";
  private muscleSrcMap: {type: string, src: string}[] = [
    {type: "2", src: "assets\\icons\\g.jpg"},
    {type: "1", src: "assets\\icons\\van.jpg"},
  ]
  constructor(public themeService: ThemeService,) { }

  ngOnInit(): void {
    this.isDarkMode = !this.themeService.isDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.update(this.isDarkMode ? 'light-mode' : 'dark-mode')
  }

  onLogout() {
    this.logoutEvent.emit();
  }

  onBack() {
    this.backArrowEvent.emit();
  }
}
