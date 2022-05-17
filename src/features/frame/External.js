import * as React from "react";
import {STATIC_URL} from "../../utils";

function loadError(onError) {
  console.error(`Failed ${onError.target.src} didn't load correctly`);
}

function ExternalScriptComponent() {

    const LoadBpmnScript = () => {
        const externalScript = document.createElement("script");
        externalScript.onerror = loadError;
        externalScript.id = "bpmn-modeler.development";
        externalScript.async = true;
        externalScript.type = "text/javascript";
        externalScript.setAttribute("crossorigin", "anonymous");
        document.body.appendChild(externalScript);
        externalScript.src = `{STATIC_URL}/js/bpmn-modeler.development.js`;
        externalScript.onload = () => {
          document.body.appendChild(externalScript);
        }
    };

    React.useEffect(() => {
        LoadBpmnScript();
    }, []);

  return <></>;
}

export default ExternalScriptComponent;