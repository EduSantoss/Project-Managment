import { Component } from './base-component.js';
import { DragTarget } from '../models/drag-drop.js';
import { Project, ProjectStatus } from '../models/project.js';
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';


// ProjectList
// responsavel pela visualizaçao na tela, e por pegar, editar as listas arrastaveis dos projetos, ativos e finalizados
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[]; // referente ao listener, guardar os projetos

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`); // super() para chamar o construtor da classe herdada
        this.assignedProjects = [];

        //  this.element.id = `${this.type}-projects`; // como iremos ter outra lista de projetos, cada um terá seu tipo especifico
        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) { // ativa ao entrar na area que pode ser removida
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault(); // ja que o default do js é nao permitir o event drag and drop
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable')
        }
    }
    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable')
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => { // filtrar entre ativo e finalizado
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });

            this.assignedProjects = relevantProjects; //estamos adicionando/sobreeescrevendo os  
            this.renderProjects();            // assignedprojects com um novo projeto, posteriormente a ideia  
            // é renderizar todos esses projetos
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';

    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = ''; // limpar todos os itens e depois renderiza novamente, evita a duplicaçao
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }
}