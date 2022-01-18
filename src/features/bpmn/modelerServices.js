import axios from "axios";
import { API_URL, callApi } from "utils";

const APP = "diagrams";

export const saveDiagram = (id, xml, project, name, desc, propierties) => {
    var data = {};
    data["xml"] = xml;
    data["project"] = project;
    data["name"] = name;
    data["desc"] = desc;
    data["propierties"] = JSON.stringify(propierties);
    
    const callback = (headers) => {
        const url = id === undefined ? `${API_URL}/${APP}/add` : `${API_URL}/${APP}/replace/${id}`;
        const f = id === undefined ? axios.post : axios.put;
        return f(url, data, {
            headers: headers
        })
    }
    return callApi(callback);
}


export const getDiagram = (id) => {
    const callback = (headers) => {
        const url = `${API_URL}/${APP}/get/${id}`;
        return axios.get(url, { headers: headers});
    }
    return callApi(callback);
}