// Component Base Class
// bases do codigo que são eventualmente sempre usadas
// -> classe generica para ser herdada e ser setados os tipos por quem herdou
// -> abstract para garantir que nao pode ser instanciada
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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