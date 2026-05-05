[AT07] Atividade 7 - Desenvolvimento de mini dashboard
terça-feira, 5 mai. 2026, 11:17
Número de respostas: 0
ATIVIDADE EM QUARTETOS

Objetivo:
Desenvolver do zero um painel de dados (dashboard) interativo utilizando HTML, CSS e JavaScript puro, aplicando manipulação dinâmica do DOM, renderização de dados a partir de arrays, filtros, cálculos e persistência com localStorage - integrando de forma prática os conteúdos trabalhados ao longo do bloco.

 

Capacidades:
CT3 - Aplicar linguagem de programação por meio do ambiente integrado de desenvolvimento (IDE).
CT5 - Aplicar métodos e técnicas de programação.
CT6 - Utilizar padrão de projeto para desenvolvimento de aplicativos.
CS3 - Fazer as atividades com organização.

 

Contexto
Painéis de dados são uma das interfaces mais comuns no desenvolvimento de sistemas profissionais. Eles concentram informações relevantes em um único lugar, permitindo que o usuário visualize, filtre e compreenda os dados rapidamente - sem precisar navegar por múltiplas telas. Nesta atividade, o grupo vai projetar e construir um mini dashboard para um contexto escolhido por vocês. A escolha do contexto é parte da atividade - o grupo decide o que faz mais sentido desenvolver.

 

Escolha do contexto
O grupo deve escolher um dos contextos abaixo ou propor um contexto próprio:

Contexto A - Torneio de e-sports
Painel com dados de jogadores de um torneio: partidas jogadas, vitórias, derrotas, K/D ratio, ranking geral. Filtros por jogador ou por jogo.

Contexto B - Biblioteca de streaming de músicas
Painel com dados de um catálogo musical: músicas, artistas, gêneros, duração, número de plays. Filtros por artista ou gênero, cálculo de duração total.

Contexto C - Academia de ginástica
Painel com dados de alunos: nome, modalidade, frequência semanal, meses de matrícula. Filtros por modalidade, cálculo de média de frequência.

Contexto livre
O grupo pode propor um contexto diferente dos três acima, desde que seja aprovado pelo docente. O contexto deve ter ao menos 5 atributos por registro e permitir filtros e cálculos.

 

Produto esperado
Um dashboard funcional composto por três arquivos separados - `index.html`, `style.css` e `script.js` - entregues em repositório no GitHub com README.

 

Requisitos técnicos obrigatórios

 

HTML:
- Página única com estrutura semântica (uso de `header`, `main`, `section`, `footer` quando aplicável)
- Área de cards ou tabela para exibição dos registros
- Ao menos um campo de filtro (input ou select) conectado ao JS
- Área de resumo com indicadores calculados (ex.: total, média, máximo)
- Seção de formulário para adicionar novo registro manualmente

 

CSS:
- Layout responsivo usando Flexbox
- Identidade visual consistente - paleta de cores, tipografia e espaçamentos padronizados em todo o arquivo
- Cards ou linhas de tabela estilizados e legíveis
- Indicadores de resumo visualmente destacados dos demais elementos

 

JavaScript:
- Array de objetos com no mínimo 8 registros iniciais representando os dados do contexto escolhido
- Função de renderização que percorre o array com `for` e gera os elementos do DOM dinamicamente
- Ao menos um filtro funcional que atualiza a exibição sem recarregar a página
- Ao menos dois indicadores calculados a partir do array (ex.: total de registros, média de um atributo numérico, valor máximo)
- Formulário funcional que adiciona novo registro ao array com `push()` e re-renderiza a lista
- Dados adicionados pelo formulário persistidos no `localStorage` - ao recarregar a página, os registros adicionados devem continuar presentes
- Código organizado em funções com responsabilidade única e nomes descritivos
- Uso de `const` e `let` - `var` não é permitido

 

Permissões
- É permitido uso de frameworks de CSS (Bootstrap, Tailwind)
- É permitido uso de bibliotecas JavaScript externas
- É permitido uso de inteligência artificial para auxiliar na geração do código

 

Rubricas

(CT3)
Insuficiente: o dashboard não abre ou não funciona no navegador; erros de sintaxe impedem a execução; arquivos não estão separados corretamente.
Básico: o dashboard abre e exibe os dados iniciais; ao menos uma funcionalidade opera corretamente; filtro ou formulário com erros de funcionamento.
Adequado: dashboard funcional com todas as funcionalidades obrigatórias operando corretamente; arquivos separados e referenciados de forma correta; código executável sem erros no console.
Avançado: além do adequado, o código demonstra domínio da manipulação do DOM (`createElement`, `appendChild`, `innerHTML`, eventos); funções bem conectadas entre si; nenhum erro ou aviso no console do navegador.

(CT5)
Insuficiente: array sem estrutura de objetos; renderização ausente ou feita manualmente (sem laço); filtro e cálculos ausentes; `var` usado no código.
Básico: array de objetos presente; renderização com `for` funcionando parcialmente; filtro ou cálculo implementado, mas com falhas; uso inconsistente de `const`/`let`.
Adequado: array com ao menos 8 registros; renderização dinâmica com `for`; filtro funcional; dois indicadores calculados corretamente; formulário com `push()` e re-renderização; `localStorage` funcionando ao recarregar; `const` e `let` usados corretamente.
Avançado: além do adequado, funções auxiliares isolam responsabilidades (ex.: função separada para calcular indicadores, função separada para renderizar, função separada para filtrar); sem repetição desnecessária de lógica; nomenclatura descritiva e consistente em todo o arquivo.

(CT6)
Insuficiente: código sem separação de responsabilidades; lógica de negócio misturada com manipulação de DOM em um único bloco.
Básico: alguma separação existe, mas é inconsistente; funções acumulam responsabilidades diversas.
Adequado: código organizado em ao menos três seções comentadas - Dados/Estado, Lógica e Interface - com funções alocadas corretamente em cada seção; CSS organizado com comentários de seção.
Avançado: além do adequado, a separação entre dados, lógica e interface é clara e justificável; o grupo demonstra compreensão do porquê cada função pertence à seção em que foi alocada; CSS sem repetições desnecessárias e com variáveis ou padrão de nomenclatura consistente.

(CS3)
Insuficiente: repositório sem estrutura; README ausente; entrega incompleta ou com arquivos faltando.
Básico: arquivos entregues mas README genérico ou incompleto; commits ausentes ou commit único ao final.
Adequado: repositório com estrutura correta, README descrevendo o contexto escolhido, as funcionalidades implementadas e como abrir no navegador; ao menos um commit por aula de desenvolvimento.
Avançado: além do adequado, commits com mensagens descritivas que refletem a evolução do projeto (ex.: `feat: renderização inicial dos cards`, `feat: filtro por categoria`, `feat: localStorage`); README com prints do dashboard funcionando.

(Plágio/NE)
NE - Cópia de trabalho de outro grupo; entrega de código idêntico entre grupos com contextos diferentes.

Ver menos
