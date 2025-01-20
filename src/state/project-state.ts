import { Project, ProjectStatus } from "../models/project";

// Project State Management
// -> pensando em uma aplicaçao maior em que temo situações com mais states como, userState quando ele esta logado ou nao, um para projects, um para um shopping cart.
// -> pensando assim, algumas coisas iriam se repetir, como o array de listeners e o addlistener()
type Listener<T> = (items: T[]) => void; //criando type para classe listeners que antes estava como any[]

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) { // chamado quando algo muda no codigo, objetivo é renderizar nas listas os objetos adicionados (projetos no caso)
        this.listeners.push(listenerFn);
    }
}

// Project State Management
export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);  // criado no Project, sempre um novo projeto estará como ativo por padrao
        this.projects.push(newProject);
        this.updateListeners();
    }

    // responsavel por pegar o id que será jogado na area arrastavel, e mover o objeto para essa area
    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice()); // passa em uma copia do array, afim de evitar conflitos e bugs com o array original
        }
    }
}

export const projectState = ProjectState.getInstance(); // criando uma unica instancia globalmente do projeto
