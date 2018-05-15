import {Component, Input, ElementRef, ViewChild} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'


@Component({
  selector: 'read-more',
  template: `
    <div [@slideInOut]="helpMenuOpen" #teste>

      <ion-list no-lines text-wrap>
        <ion-item *ngFor="let product of products;">
          <ion-grid>
            <ion-row>
              <ion-col col-12>
                <h2>{{product.name}}</h2>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col col-6 text-left>
                <p>R$ {{product.value.toFixed(2).toString().replace('.', ',')}}</p>
              </ion-col>
              <ion-col col-2 text-center>
                <p>x{{product.amount}}</p>
              </ion-col>
              <ion-col col-4 text-right>
                <p>R$ {{ (product.value * product.amount).toFixed(2).toString().replace('.', ',') }}</p>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>

    </div>
    <a (click)="toggleDetails()">
      {{helpMenuOpen === 'out' ? 'Detalhes' : 'Esconder'}}
      <ion-icon style="font-size: 1.2em !important;" [name]="helpMenuOpen === 'out' ? 'arrow-down' : 'arrow-up'"></ion-icon>
    </a>
  `,
  styles: [`
      a {
          text-decoration: none !important;
          color: #00447f;
          font-size: 1.2em;
      }
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: 'auto',
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
      })),
      transition('in => out', animate('500ms ease-in')),
      transition('out => in', animate('500ms ease-out'))
    ])
  ]
})
export class ReadMoreComponent {
  @ViewChild('teste') elementRef: ElementRef;

  // The products array that should be used in the container
  @Input() products: any;

  helpMenuOpen: string = 'out';

  constructor () {
  }

  /**
   * Show invoice details
   */
  toggleDetails () {
    this.helpMenuOpen = this.helpMenuOpen === 'out' ? 'in' : 'out';
  }
}
