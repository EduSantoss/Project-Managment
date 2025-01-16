// Project Type
// classe para guardar os tipos especificos sendo utilizados, utilizando classe para poder instanciar (interfaces e types nao podem ser instanciados)
export enum ProjectStatus { Active, Finished }

export class Project { // criado type para metodos que antes estavam como any[] ou passando eles mesmos os valores
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) { }
}

