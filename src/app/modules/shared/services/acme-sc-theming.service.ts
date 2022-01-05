import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AcmeSCThemingService {

  private renderer: Renderer2;
  selectedTheme: string;

  constructor(rendererFactory: RendererFactory2) {
      this.renderer = rendererFactory.createRenderer(null, null);
  }

  setTheme(theme) {
    this.renderer.removeClass(document.body, this.selectedTheme);
    this.renderer.addClass(document.body, theme);
    this.selectedTheme = theme;
  }

  getTheme() {
    return this.selectedTheme;
  }
}
