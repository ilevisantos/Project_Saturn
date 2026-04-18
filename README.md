SATURN - Plataforma de Streaming
📄 DESCRIÇÃO

Saturn é uma plataforma de streaming inspirada em serviços como Netflix e Disney+, desenvolvida como projeto de estudo. O projeto simula uma experiência completa de streaming com seleção de perfis, catálogo de filmes e séries, sistema de pesquisa e interface responsiva.

🚀 TECNOLOGIAS UTILIZADAS
HTML5
CSS3 (Flexbox, Grid, Animações)
JavaScript (ES6+)
Font Awesome (ícones)
Google Fonts (Roboto)


## 📁 ESTRUTURA DO PROJETO
```bash
Projeto-disney/
├── index.html              # Página de seleção de perfis
├── catalogo/
│   ├── catalogo.html       # Página principal do catálogo
│   ├── catalogo.css        # Estilos da página do catálogo
│   └── js/
│       ├── main.js         # Lógica principal do catálogo
│       ├── data.js         # Dados dos filmes e séries
│       ├── utils.js        # Utilitários
│       └── components/
│           ├── Card.js     # Componente de cartão de filme/série
│           └── Carousel.js # Componente de carrossel
├── css/
│   └── estilo.css          # Estilos da página de perfis
├── js/
│   ├── index.js            # Lógica da página de perfis
│   └── script.js           # Scripts gerais (tema, dropdown)
└── img/                    # Imagens e avatares
```
✨ FUNCIONALIDADES IMPLEMENTADAS

1. SELEÇÃO DE PERFIS
Criação de perfis personalizados
Seleção de avatares
Edição e exclusão de perfis
Persistência no localStorage

2. CATÁLOGO DE CONTEÚDO
Carrosséis organizados por categorias
Cards interativos com hover effects
Showcase principal com navegação
Sistema de pesquisa em tempo real

3. SISTEMA DE PESQUISA
Campo expansível com animação
Filtragem por nome de filme/série
Resultados dinâmicos
Fechamento automático (Escape/clique fora)

4. INTERFACE E UX
Design responsivo
Tema escuro com toggle claro/escuro
Animações suaves
Navegação intuitiva
Notificações dropdown

5. RECURSOS TÉCNICOS
Drag & drop em dispositivos móveis
Transições de página
Lazy loading de imagens
Acessibilidade (ARIA labels)


▶️ COMO EXECUTAR

Clone ou baixe o projeto
Abra um terminal na pasta do projeto
Execute:
python -m http.server 8000
Acesse:
http://localhost:8000


🧭 NAVEGAÇÃO

index.html: Seleção/gerenciamento de perfis
catalogo/catalogo.html: Catálogo principal de conteúdo


📊 DADOS

Os dados dos filmes e séries estão organizados em data.js com:

Categorias (Épicos, Séries, Para maratonar)
Informações completas (nome, descrição, imagem, badges)
Links para trailers no YouTube


🛠️ DESENVOLVIMENTO

Este projeto foi desenvolvido como parte de um curso de JavaScript, demonstrando:

Manipulação do DOM
Eventos e interatividade
Armazenamento local
Componentização
Responsividade
Boas práticas de código

👤 AUTOR

Projeto desenvolvido durante estudos de JavaScript e desenvolvimento web.

📅 DATA

Abril 2026

📝 NOTAS
O projeto utiliza dados fictícios para fins educacionais
Algumas imagens são referências externas (URLs)
Compatível com navegadores modernos
Otimizado para desktop e dispositivos móveis
