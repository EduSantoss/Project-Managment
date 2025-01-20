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

## Webpack

-> Basicamente todo arquivo que é enviado e compilado, tem uma duração, um padrão de carregamento pelo http request, e imports ajudam a aumentar esse tempo. Pode ser visto no inspecionar e na área network.

-> Na nossa máquina é óbvio que funciona mais rápido, mas pensando em um deploy com tantos request, pode realmente deixar lento o site e seu carregamento.

-->> É ai que entra o Webpack, ferramenta que ajuda a agrupar os arquivos para diminuir a quantidade de https requests. Também ajuda em outras funções, como otimização do código, para ter um download mais rápido.

```
Instalando algumas ferramentas (lembrar de iniciar o npm)

npm init   -> Iniciar projeto node
npm start  -> iniciar o server, no geral também pode ser feito com a própria extensão do vccode.
-----------------
-> Baixar lite-server: 
npm install lite-server --save-dev

-> Adicionar em "scripts" no package.json:
"start": "lite-server"

-> Iniciar server: 
npm run dev
---------------
npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader  -> Vai instalar diferentes pacotes, dentre eles uma para um versão de projeto do typescript, o que permite que nao seja alterado por atualizações globais futuras

-> Não precisa mais do "rootDir", pois o webpack irá direcionar os arquivos TS

-> Criar arquivo webpack.config.js, com esse nome para ele ser reconhecido pelo webpack

->> Também deve-se remover o .js dos arquivos nos imports
```

-> Configurações no arquivo webpack.config.js

-> Setar "sourceMap": true no arquivo tsconfig.json  

-> Setar "build": "webpack" no package.json, em "scripts"
```
const path = require('path');

module.exports = { // qual pasta deve ser vista primeiro
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist ')
  },
  devtool: 'inline-source-map',
  module: { // como ele deve se portar, no caso, transformar ts em js
    rules: [
        { // expressao regular para checar arquivos que terminam em .ts
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/ 
        }
     ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}

-> npm run build para rodar o carregamento

-> Alterar no html de app.js para bundle.js

-> npm start
```

## Ajustes no Webpack Config

-> Iremos adicionar o webpack-dev-server, ferramenta que permite rodar o desenvolvimento do server localmente que serve como website.

-> Setar outputs publicos

-> Setar webpack-dev-server no arquivo packege.json, em "scripts", no lugar de "start".


```
-------------ALTERAÇÕES------------

const path = require('path');

module.exports = { // qual pasta deve ser vista primeiro
    mode: 'development',
    entry: './src/app.ts',
    devServer: {
        static: [
            {
                directory: path.join(__dirname),
            },
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
    module: { // como ele deve se portar, no caso, transformar ts em js
        rules: [
            { // expressao regular para checar arquivos que terminam em .ts
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
```

-> Após npm start, acessar localmente o local do link, http://localhost:8080/.

#### Para Produção

-> Criar arquivo webpack.config.prod.js.

-> Alterar "build": "webpack" em package.json, para "build": "build": "webpack --config webpack.config.prod.js"

-> Fornece código otimizado para production.

```
npm install --save-dev clean-webpack-plugin  -> instalar para ajudar a limpar pastas dist 
---------------------------------------------------------------------
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = { // qual pasta deve ser vista primeiro
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: { // como ele deve se portar, no caso, transformar ts em js
        rules: [
            { // expressao regular para checar arquivos que terminam em .ts
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [ // ajudar a limpar a pasta dist, para termos sempre a versão mais atualizada do js
       new CleanPlugin.CleanWebpackPlugin()
    ]
}
```

## 3rd Party libraries

-> Lodash, livraria JS, otima para otimizar o código.

-> Necessário instalar e importar no código, junto com os tipos, no caso do Typescript.

-> Class-transformer para aqueles que não possuem tipos.







