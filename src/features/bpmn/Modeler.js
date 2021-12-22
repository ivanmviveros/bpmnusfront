import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { 
    setBackdropOpen, 
    enqueueSnackbar as enqueueSnackbarAction,
} from 'features/frame/mainFrameSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeDiagramXML, selectDiagramXML, selectUrl } from './modelerSlice';

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default function BpmnModeler() {
    //const { url, diagramXML } = props;
    const diagramXML = useSelector(selectDiagramXML);
    const url = useSelector(selectUrl);
    let [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const containerRef = React.createRef();
    let bpmnViewer = null;
    let eventBus = null;

    const displayDiagram = (diagramXML) => {
        bpmnViewer.importXML(diagramXML);
    }
    
    const fetchDiagram = (url) => {
        handleLoading();
    
        fetch(url)
          .then(response => response.text())
          .then(text => dispatch(changeDiagramXML(text)))
          .catch(err => handleError(err));
    }

    const handleLoading = () => {
        dispatch(setBackdropOpen(true));
    }
    
    const handleError = (err) => {
        dispatch(setBackdropOpen(false));
        console.log(err);
        err && enqueueSnackbar({
            key: new Date().getTime() + Math.random(),
            message: `Hay errores`,
            options: {
                variant: 'error'
            },
            dismissed: false
        });
    }
    
    const handleShown = (warnings) =>{
        dispatch(setBackdropOpen(false));
        warnings.length && enqueueSnackbar({
            key: new Date().getTime() + Math.random(),
            message: `Hay alertas`,
            options: {
                variant: 'success'
            },
            dismissed: false
        });
    }

    React.useEffect(() => {
        const container = containerRef.current;
        bpmnViewer = new BpmnJS({ 
            container,
            keyboard: {
                bindTo: document
            }
        });

        bpmnViewer.on('import.done', (event) => {
            const { error, warnings  } = event;
            if (error) return handleError(error);
            bpmnViewer.get('canvas').zoom('fit-viewport');
            return handleShown(warnings);
        });
        eventBus = bpmnViewer.get('eventBus');
        var events = [
            'element.hover',
            'element.out',
            'element.click',
            'element.dblclick',
            'element.mousedown',
            'element.mouseup'
        ];
          
        events.forEach(function(event) {
            eventBus.on(event, function(e) {
                console.log(event, 'on', e.element);
            });
        });

        bpmnViewer.on('selection.change', function(e) {
            console.log("a");
        });
        bpmnViewer.on('element.changed', function(e) {
            console.log(e);
        });

        if (url) fetchDiagram(url);
        if (diagramXML) displayDiagram(diagramXML);
    }, [url, diagramXML]);


    return (
        <div className="react-bpmn-diagram-container" ref={ containerRef } style={
            {
                height: '800px',
                width: '100%',
                marginTop: '5px',
                overflow: 'hidden',
                padding: 0,
                borderStyle: 'double'
            }
        }></div>
    );

} 
