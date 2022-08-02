import React from "react";


export default function UserStoryDetail({id, desc, actor, title, points, project, criteria, priority, full_desc, relations, restrictionsw}){
    return (
        <>
            <h3>Historia de usuario</h3>
            <p>
                <b>ID</b>: {id}
                <br/>
                <b>Título</b>: {title}
                <br/>
                <b>Descripción</b>: {full_desc}
                <br/>
                <b>Actor</b>: {actor}
                <br/>
                <b>Puntos</b>: {points}
                <br/>
                <b>Proyecto</b>: {project}
                <br/>
                <b>Criterios de aceptación</b>: {criteria}
                <br/>
                <b>Prioridad</b>: {priority}
                <br/>
                <b>Restricciones</b>: {restrictionsw}
                <br/>
                <b>Dependencias</b>:
            </p>
            {relations && <ul> {relations.map((relation, i) => {return <li key={i}>{relation}</li>})} </ul>}
        </>
    );
}