import { Component, Input, AfterViewInit } from '@angular/core';
import { INode } from '@models/node';
import { IFlowchart } from '@models/flowchart';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '12px sans-serif';

@Component({
  selector: 'parameter-viewer',
  templateUrl: './parameter-viewer.component.html',
  styleUrls: ['./parameter-viewer.component.scss']
})
export class ParameterViewerComponent implements AfterViewInit {
    @Input() flowchart: IFlowchart;
    @Input() startNode: INode;
    @Input() endNode: INode;

    ngAfterViewInit() {
        const textarea = document.getElementById('display-flowchart-desc');
        if (!textarea) { return; }
        const desc = this.flowchart.description.split('\n');
        const textareaWidth = textarea.getBoundingClientRect().width - 20;
        let lineCount = 0;
        for (const line of desc) {
            lineCount += Math.floor(ctx.measureText(line).width / textareaWidth) + 1;
        }
        textarea.style.height = lineCount * 14 + 4 + 'px';
    }

    displayName() {
        return this.flowchart.name.replace(/_/g, ' ');
    }

}

