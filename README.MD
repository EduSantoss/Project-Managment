# Project Managment

-> Criar um quadro para gestão de projetos.


## Modules & Namespaces

-> Usados para organizar arquivos, imports diferentes, e movimentar classes diferentes.

### Namespaces

-> Feature legado, por isso que mesmo importando incorretamente, ou não referenciando com "reference path", ele ainda funciona.
```
/// <reference path="drag-drop-interfaces.ts" />  -> necessário referenciar assim com namespaces
-> Criar namespaces com mesmo nome, no caso desse código, 'App', assim nao precisa colocar dentro de vários namespaces.

-> Porém surge um problema, JS nao reconhece os namespaces

"outFile": "./dist/bundle.js"  -> Para jogar a saida do TS em uma unica pasta do js, para que compile corretamente

-> Para isso precisa alterar também o "module": "AMD" e colocar AMD ou system.
```

### Modules

-> Utilizar os imports padrão.

-->>> Nesse caso deve-se referenciar os arquivos .js 

-->>> Nesse caso serão criadas várias pastas iguais no js, diferente do anterior que seria tudo em uma só.

-> Existem algumas outras maneiras de imports, como o * as validation from, interessante para quando tenha nomes parecidos, desse jeito é preciso utilizar o dot notation, validation.validate para chamar a funçao.


```
import { Project, ProjectStatus } from "../models/project";  -> exemplo do código

-> Desativar "outFile"

-> Alterar module: para es2015 ou superior.

-> Ir no html, onde é recebido o script, remover o "defer" da tag <script> e adicionar type="module".

```


