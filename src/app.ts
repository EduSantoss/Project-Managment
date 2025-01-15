// Drag & Drop Interfaces
interface Draggable {
    dragStartHandler(event: DragEvent): void; // responsavel pelo agarrar e mover objeto
    dragEndHandler(event: DragEvent): void; // responsavel pelo soltar do objeto, informar o que ocorreu
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

// Project Type
// classe para guardar os tipos especificos sendo utilizados, utilizando classe para poder instanciar (interfaces e types nao podem ser instanciados)
enum ProjectStatus { Active, Finished }

class Project { // criado type para metodos que antes estavam como any[] ou passando eles mesmos os valores
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) { }
}



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
class ProjectState extends State<Project> {
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

const projectState = ProjectState.getInstance(); // criando uma unica instancia globalmente do projeto

// Validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
// interface e funcao de validaçao, seria interessante em projetos maiores, mas aqui é uma reescrita infinita.
function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

// Component Base Class
// bases do codigo que são eventualmente sempre usadas
// -> classe generica para ser herdada e ser setados os tipos por quem herdou
// -> abstract para garantir que nao pode ser instanciada
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T; // onde vai ser carregado o form, final da pagina do index.html
    element: U;

    constructor(templateId: string, hotElementId: string, insertAtStart: boolean, newElementId?: string) { // NewElementId opcional
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hotElementId)! as T;

        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;  // serão herdadas e precisam ser configurados no local herdado
    abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() { // getter responsavel para o texto de quantas pessoas estao no projeto
        if (this.project.people === 1) {
            return '1 person';
        } else {
            return `${this.project.people} persons`;
        }
    }

    constructor(hostId: string, project: Project) { // adicionar o item da fila no final, logo, deve-se passar false
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent) { // colar o id do objeto é tudo que é preciso para arrastar depois
        console.log(event);
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(event: DragEvent) {
        console.log('dragend');

    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

// ProjectList
// responsavel pela visualizaçao na tela, e por pegar, editar as listas arrastaveis dos projetos, ativos e finalizados
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor() {
        super('project-input', 'app', true, 'user-input') // true pq quer criar o novo objeto no começo para a ProjectInput class
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }
    // -->> Por convençao é bom deixar os metodos publicos primeiro que os privados
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this)) // esse bind(this) para referenciar corretamente, nao só a classe, mas também ao submitHandler. ou criar um decorator para isso
    }

    renderContent() { }

    private gatherUserInput(): [string, string, number] | void { // usar tupla, usar void para corrigir erro de return
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if ( // criar uma funçao reusavel de validaçao  
            // enteredTitle.trim().length === 0 || 
            // enteredDescription.trim().length === 0 || 
            // enteredPeople.trim().length === 0
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert('Invalid input, please try again!');
            // return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() { // responsavel por limpar os campos de inputs 
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind // autobind decorator ou apenas bind na classe configure abaixo, vai da situaçao.
    private submitHandler(event: Event) {
        event.preventDefault();
        // console.log(this.titleInputElement.value); -> teste anterior de print no console
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            //  console.log(title, desc, people);  -> teste anterior de print no console
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');













