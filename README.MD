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




