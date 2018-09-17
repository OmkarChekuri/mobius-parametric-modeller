import * as ACTION from './actions';
import { IFlowchart } from '@models/flowchart';

export interface IAppState{
    name: string;
    author: string; 
    flowchart: IFlowchart;
    last_updated: Date;
    version: number;
}

export const INITIAL_STATE: IAppState = {
    name: "default_file.mob",
    author: "new_user", 
    flowchart: <IFlowchart>{ nodes: [
            {name: "first_node", position: {x: 0, y: 0}}, 
            {name: "second_node", position: {x: 0, y: 0}}, 
        ]},
    last_updated: new Date(),
    version: 0
}

export function rootReducer(state, action){

    switch (action.type) {

        case ACTION.ADD_NODE:
            return Object.assign({}, state);
            // return Object.assign({}, state, FlowchartUtils.add_node(state.flowchart));
        
        case ACTION.NEW_FLOWCHART:
            state.flowchart = <IFlowchart>{}
            return Object.assign({}, state, state);
        
        case ACTION.LOAD_FLOWCHART:
            state.flowchart = action.flowchart.flowchart;
            return Object.assign({}, state, state);

    }

    return state;
}


