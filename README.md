Read ME:


# TEST-QA

## Descrição do Projeto

Este projeto é uma suíte de testes automatizados para a API de um sistema de produtos, focando em garantir a correta funcionalidade dos endpoints de CRUD de produtos e autenticação de usuários. Os testes incluem cenários positivos e negativos, cobrindo uma ampla gama de casos de uso e validações.


## Pré-requisitos

•⁠  ⁠*Node.js* (versão recomendada: >= 14.x)
•⁠  ⁠*Yarn* ou *NPM*
•⁠  ⁠*API* deve estar rodando localmente na porta 3000.

## Instalação

1.⁠ ⁠Clone o repositório:

   ⁠ bash
   git clone https://github.com/joaaoinacio/test-qa.git
   cd test-qa
    ⁠

2.⁠ ⁠Instale as dependências:

   ⁠ bash
   yarn install
   # ou
   npm install
    ⁠

## Scripts Disponíveis

No projeto, você pode utilizar os seguintes comandos para rodar os testes:

•⁠  ⁠*Rodar todos os testes*:

   ⁠ bash
   yarn test:run
   # ou
   npm run test:run
    ⁠

•⁠  ⁠*Rodar um teste específico*:

   Você pode rodar um teste específico passando o caminho do arquivo de teste:

   ⁠ bash
   yarn test:run -- tests/product/product-create.test.ts
    ⁠

   Este comando executa apenas o teste localizado no caminho especificado.

## Dependências

O projeto utiliza as seguintes dependências principais:

•⁠  ⁠⁠ @nestjs/common ⁠: Framework usado para construir a API.
•⁠  ⁠⁠ @nestjs/testing ⁠: Utilitário de testes do NestJS.
•⁠  ⁠⁠ jsonwebtoken ⁠: Biblioteca para trabalhar com tokens JWT.
•⁠  ⁠⁠ supertest ⁠: Biblioteca para realizar testes de integração em APIs.

E as seguintes dependências de desenvolvimento:

•⁠  ⁠⁠ typescript ⁠: Linguagem usada para escrever o código do projeto.
•⁠  ⁠⁠ jest ⁠: Framework de testes utilizado.
•⁠  ⁠⁠ ts-jest ⁠: Para usar TypeScript com Jest.
•⁠  ⁠⁠ @types/jest ⁠: Tipos do Jest para TypeScript.
•⁠  ⁠⁠ @types/jsonwebtoken ⁠: Tipos para a biblioteca jsonwebtoken.
•⁠  ⁠⁠ @types/supertest ⁠: Tipos para a biblioteca supertest.

## Como Executar os Testes

1.⁠ ⁠Certifique-se de que a API está rodando localmente na porta 3000.
2.⁠ ⁠Execute os testes com o comando especificado acima.