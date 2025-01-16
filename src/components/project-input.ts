import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
