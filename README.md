## Primeiros passos

Para rodar o projeto local, basta rodar um dos comandos abaixo, para instalar as dependências:

```bash
npm run install
# or
yarn install
# or
pnpm install
# or
bun install
```

Após isso, basta iniciar o projeto:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para visualizar

Todas as variáveis estão configuradas para executar o projeto. Não é necessário nenhuma configuração extra.

## Escolha da Stack

O projeto foi construído usando um monorepo, aonde o é usado o front e o back com Nextjs. Escolhi usar o langchain como framework, dessa forma consigo analisar a mensagem e seleciono qual agente eu chamo. Na escolha de apis utilizei openweathermap para api de clima, exchangerate-api para a cotação das moedas e para o pdf eu formato o pdf em texto e passo pra o próprio langchain interpretar e me devolver as informações.

## Escolha da Stack

Documentação de diagrama se encontra na pasta /docs
