import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme: 'dark-mode' | 'light-mode' = "dark-mode";

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  initTheme() {
    this.loadColorTheme();
    this.update(this.colorTheme);
  }

  update(theme: 'dark-mode' | 'light-mode') {
    this.renderer.removeClass(document.body, this.colorTheme);
    this.renderer.addClass(document.body, theme);
    this.setColorTheme(theme);
  }

  isDarkMode() {
    return this.colorTheme === 'dark-mode';
  }

  private setColorTheme(theme: 'dark-mode' | 'light-mode') {
    this.colorTheme = theme;
    localStorage.setItem('user-theme', theme);
  }

  private loadColorTheme() {
    this.colorTheme = localStorage.getItem('user-theme') as 'dark-mode' | 'light-mode' ?? "dark-mode";
  }
}