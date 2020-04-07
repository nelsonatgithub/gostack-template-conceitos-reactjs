import React, { useState, useEffect, useRef } from "react";

import "./styles.css";
import api from "./services/api";

const projectCard = ({
    repo,
    onClickRemove,
}) => (
        <div key={repo.id} style={{ width: '300px' }} >
            <h3>{repo.title}</h3>
            <p>Link: {repo.url}</p>
            <p>Techs: {repo.techs ? repo.techs.join(', ') : null}</p>
            <button onClick={() => onClickRemove(repo.id)}>
                {'Remover'}
            </button>
        </div>
    )

const parseTechsString = techsString => techsString.replace(/\s/g, '').split(',');

function App() {
    useEffect(() => {
        api.get('repositories').then(response => {
            setProjects(response.data);
        });
    }, []);

    const cleanInputs = () => {
        titleInput.current.value = '';
        urlInput.current.value = '';
        techStringInput.current.value = '';
    };

    async function handleAddRepository() {
        const newProject = {
            title: titleInput.current.value,
            url: urlInput.current.value,
            techs: parseTechsString(techStringInput.current.value),
        };
        const { data } = await api.post('repositories', {
            newProject,
        });
        cleanInputs();
        setProjects([
            ...projectList,
            data,
        ]);
    }

    async function handleRemoveRepository(id) {
        cleanInputs();
        const { status } = await api.delete(`repositories/${id}`);
        if (status === 204) {
            setProjects(projectList.filter(project => project.id !== id));
        }
    }

    const [projectList, setProjects] = useState([]);
    const titleInput = useRef();
    const urlInput = useRef();
    const techStringInput = useRef();

    return (
        <div>
            <h1>{'Lista de Projetos'}</h1>
            <ul
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
                data-testid="repository-list"
            >
                {projectList.map(
                    project => projectCard({
                        repo: project,
                        onClickRemove: handleRemoveRepository,
                    })
                )}
            </ul>

            <h1>{'Novo Projeto'}</h1>
            <form>
                <input
                    ref={titleInput}
                    placeholder="Título do projeto" 
                    type="text"
                    /> <br />
                <input 
                    ref={urlInput}
                    placeholder="Link" 
                    type="text"
                    /> <br />
                <input 
                    ref={techStringInput}
                    placeholder="Techs, separado por vírgula"
                    type="text"
                />
            </form>
            <button onClick={() => handleAddRepository()}>
                {'Adicionar'}
            </button>
        </div>
    );
}

export default App;
