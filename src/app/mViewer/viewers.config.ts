import { IView } from './view.interface'; 
// Step-1: Add new ViewerComponet here
import { TextViewerComponent } from './viewers';
import { GSViewerComponent } from './viewers/gs-viewer/gs-viewer.component';
import { ConsoleViewerComponent } from './viewers/console-viewer.component';

export const VIEWER_ARR = [
    TextViewerComponent, 
    ConsoleViewerComponent, 
    //JSONViewerComponent, 
    //ThreeViewerComponent
    // Step-2: Add Component here
    //CesiumViewerComponent,
    GSViewerComponent,
    //MobiuscesiumComponent,
];

export const Viewers: IView[] = [
    { name: 'Summary', icon: undefined, component: TextViewerComponent },
    { name: 'gs-viewer', icon: undefined, component: GSViewerComponent },
    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    // { name: 'json-viewer', icon: undefined, component: JSONViewerComponent },
    // Step-3: Add Viewer Definition here: name, icon and component
    //{ name: 'three-viewer', icon: undefined, component: ThreeViewerComponent },
    //{ name: 'cesium-viewer', icon: undefined, component: CesiumViewerComponent },
    //{ name: 'mobius-cesium', icon: undefined, component: MobiuscesiumComponent },
];

