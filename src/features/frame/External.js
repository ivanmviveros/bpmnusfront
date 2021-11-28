import * as React from "react";

function loadError(onError) {
  console.error(`Failed ${onError.target.src} didn't load correctly`);
}

function ExternalScriptComponent() {
  React.useEffect(() => {
    const LoadExternalScript = () => {
      const externalScript = document.createElement("script");
      externalScript.onerror = loadError;
      externalScript.id = "external";
      externalScript.async = true;
      externalScript.type = "text/javascript";
      externalScript.setAttribute("crossorigin", "anonymous");
      document.body.appendChild(externalScript);
      externalScript.src = `http://127.0.0.1:8000/static/js/bpmn-modeler.development.js`;
    };
    LoadExternalScript();
  }, []);

  return <></>;
}

export default ExternalScriptComponent;