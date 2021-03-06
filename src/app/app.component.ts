import {
  Component,
  HostBinding,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit, NgZone
} from '@angular/core';

import { HeaderDynamicDemoRefService } from './header/header-dynamic-demo-ref.service';
import {
  SohoPersonalizeDirective,
  SohoRenderLoopService
} from 'ids-enterprise-ng';

@Component({
  selector: 'body', // tslint:disable-line
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [ HeaderDynamicDemoRefService ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  @ViewChild(SohoPersonalizeDirective) personalize: SohoPersonalizeDirective;

  @HostBinding('class.no-scroll') get isNoScroll() { return true; }

  public useUpliftIcons = false;

  public personalizeOptions: SohoPersonalizeOptions = {};

  constructor(private readonly renderLoop: SohoRenderLoopService) {
    // Init render loop manually for Angular applications
    // Ensures requestAnimationFrame is running outside of Angular Zone
    this.renderLoop.start();
  }

  ngAfterViewInit(): void {
    // Has to run after the view has been initialised otherwise
    // the personalise component is not ready.
    this.setInitialPersonalization();
  }

  setInitialPersonalization() {
    const theme = localStorage.getItem('soho_theme');
    let colors = localStorage.getItem('soho_color');
    if (theme) {
      this.personalize.theme = theme;
    }
    if (colors) {
      colors = JSON.parse(colors);
      this.personalize.colors = colors;
    }
  }

  onChangeTheme(ev: SohoChangeThemePersonalizeEvent) {
    this.useUpliftIcons = ev.theme === 'uplift';
    console.log('Theme changed: ', ev);
    localStorage.setItem('soho_theme', ev.theme);
  }
  onChangeColors(ev: SohoChangeColorsPersonalizeEvent) {
    console.log('Colors changed: ', ev);
    localStorage.setItem('soho_color', JSON.stringify(ev.colors));
  }
}
