import { IFlowchart } from './flowchart.interface';
import { NodeUtils, INode } from '@models/node';
import { NgModuleFactoryLoader } from '@angular/core';

export class FlowchartUtils{
    
    public static newflowchart(): IFlowchart{
        const flw: IFlowchart = { 
            language: "js",
            meta: {
                selected_nodes: [0]
            },
            nodes: [  NodeUtils.getStartNode(), NodeUtils.getEndNode()  ],
            edges: [],
            functions: [],
            ordered: false
        }

        return flw;
    }

    static checkNode(nodeOrder: INode[], node: INode){
        if (node.hasExecuted){
            return
        } else if (node.type === 'start' ){
            nodeOrder.push(node)
        } else {
            for (let edge of node.inputs[0].edges){
                if (!edge.source.parentNode.hasExecuted){
                    return
                }
            }
            nodeOrder.push(node)
        }
        node.hasExecuted = true;
        for (let edge of node.outputs[0].edges){
            FlowchartUtils.checkNode(nodeOrder, edge.target.parentNode);
        }
    }

    public static orderNodes(flw: IFlowchart){
        var startNode = undefined;
        for (let node of flw.nodes){
            if (node.type === 'start'){
                startNode = node;
            }
            node.hasExecuted = false;
        }
        var nodeOrder = [];
        FlowchartUtils.checkNode(nodeOrder, startNode);
        if (nodeOrder.length < flw.nodes.length){
            for (let node of flw.nodes){
                if (node.type != 'start' && node.inputs[0].edges.length == 0){
                    FlowchartUtils.checkNode(nodeOrder, node);
                }
            }
        }
        flw.nodes = nodeOrder;
        flw.ordered = true;
    }
}
