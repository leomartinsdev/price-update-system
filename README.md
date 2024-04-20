# Price Update System
Software de atualização de preços de produtos e pacotes feito para o processo seletivo da empresa Shopper.<br>
No software, o usuário pode carregar um arquivo de precificação em csv (no modelo que está presente no projeto) e, ao pressionar VALIDAR, uma séria de validações são feitas para confirmar que o preço pode ser atualizado.
Caso nenhum produto falhe na validação, o botão ATUALIZAR é liberado e o usuário pode atualizar os preços.
Caso algum produte falhe na validação, o botão ATUALIZAR não será liberado.<br><br>
As validações são:
- O novo preço não deve ficar abaixo do custo;
- Não é possível realizar um reajuste maior ou menor do que 10% do preço atual do produto;
- O mesmo arquivo deve contar os reajustes dospreços dos componentes do pacote de modo que o preço final da soma dos componentes seja igual ao preço do pacote;
- Todos os campos devem existir;
- Os códigos de produtos devem existir;
- Os preços estão preenchidos e são valores númeriso validos.
<br>
Ao final da validação, o sistema exibe as seguintes informações dos produtos que foram enviados: Código, Nome, Preço Atual e Novo Preço.<br>
Caso uma ou mais regras de validação tenham sido quebradas, o sistema também alerta o usuário ao lado de cada produto qual regra foi quebrada.
<br><br>



## Feito com 👨‍💻:
- Frontend:
- - Typescript
  - React
- Backend:
- - Typescript
  - Node.js
  - Sequelize (ORM)
  - Express
- Banco de Dados:
- - MySQL 8

<br>
## Como rodar o projeto:
1)  Clone o repositório;
2)  Entre no diretório do projeto;
3)  Instale as dependências: `npm run install:apps`;
5)  Inicie os containeres: `npm run compose:up`;
6)  Pronto! Toda a aplicação está configurada em um docker de maneira que, ao rodar o comando acima, o Docker: cria um container para o banco de dados, outro para o backend e outro para o frontend. Além disso, os containers executa uma série de scripts que: inicializam o frontend (http://localhost:3000) e o backend (http://localhost:3001), rodam as migrations e o seeders do banco de dados e deixa tudo pronto para uso.

Observações:
Esse projeto utiliza Docker. Portanto, caso não tenha em sua máquina, é possível instalar visitando seguindo a documentação do [site oficial do Docker](https://docs.docker.com/engine/install/).<br>
É possível resetar o banco de dados para seu estado original executando o comando `npm run db:reset` dentro do diretório de backend (`app/backend`).

## Portas: o projeto utiliza 3 portas, portanto é essencial que elas estejam livres no seu computador:
- 3000 - para o frontend
- 3001 - para o backend
- 5173 - para o vite

<br>
## Variáveis de ambiente:
- Para conveniência, as variáveis de ambiente necessárias para o projeto já estão rodando nos containeres Docker do projeto. Porém, é importante mencionar que em um software em produção (sendo usado em um projeto real) a boa prática é colocar as variáveis de ambiente em um arquivo `.env` e, no arquivo `docker-compose` instruir o Docker a ler esse arquivo. Além disso, é necessário colocar o arquivo `.env` no `.gitignore` para que ele não fique disponível fora do seu diretório local.

<br>
## Como conectar ao banco no Azure Data Studio, MySQL Workbench, ou outro Database Manager:
- Server: localhost
- user: root
- password: 123456

<br>
## Documentação 📑

### Endpoint /products (http://localhost:3001/products)
#### POST
- Recebe um arquivo CSV e o valida.
<br><br>
#### PATCH
- Atualiza o banco de dados baseado nas informações do arquivo CSV.
