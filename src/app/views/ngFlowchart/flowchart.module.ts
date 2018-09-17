import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material';

import { FlowchartComponent } from './flowchart.component';
import { NodeComponent } from './node/node.component';
import { PortComponent } from './port/port.component';
import { DraggableDirective } from './directives/draggable.directive';


@NgModule({
  declarations: [
    FlowchartComponent, 
    NodeComponent, 
    PortComponent, 
    DraggableDirective
  ],
  exports: [ FlowchartComponent ],
  imports: [ CommonModule,
             FormsModule, 
             MatIconModule ],
  entryComponents: [ ],
  providers: [ ]
})
export class NgFlowchart {
    constructor () { }
}
