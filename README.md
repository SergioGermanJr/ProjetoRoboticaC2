# 🍽️ Reconhecimento de Alimentos — Projeto Prático C2

> **Disciplina:** Robótica e Sistemas Inteligentes  
> **Avaliação:** Projeto Prático C2 — Reconhecimento de Objetos  
> **Professor:** Otávio Lube  
> **Data de apresentação:** 26/05/2026

---

## 📋 Sumário

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Algoritmo Utilizado](#algoritmo-utilizado)
3. [Classes Reconhecidas](#classes-reconhecidas)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Tecnologias](#tecnologias)
6. [Como Executar](#como-executar)
7. [Como Funciona](#como-funciona)
8. [Interface](#interface)
9. [Modelo Treinado](#modelo-treinado)

---

## Sobre o Projeto

Este projeto implementa um sistema de **reconhecimento de alimentos em tempo real** diretamente no navegador, sem necessidade de servidor back-end ou instalação de dependências.

A câmera do dispositivo é usada para capturar frames continuamente. Cada frame é processado por uma rede neural convolucional (MobileNet v2) que classifica o alimento presente na imagem entre as 4 classes treinadas, exibindo a probabilidade de cada classe em tempo real.

O projeto foi desenvolvido como parte da avaliação **C2** da disciplina de Robótica e Sistemas Inteligentes, com foco em demonstrar o domínio de uma técnica de reconhecimento de objetos.

---

## Algoritmo Utilizado

### Google Teachable Machine — MobileNet v2

O modelo foi criado com o **Google Teachable Machine**, que usa internamente a arquitetura **MobileNet v2** com *transfer learning*.

| Propriedade         | Valor                        |
|---------------------|------------------------------|
| Arquitetura base    | MobileNet v2                 |
| Técnica             | Transfer Learning            |
| Framework de treino | Teachable Machine v2.4.12    |
| Framework de inferência | TensorFlow.js 1.7.4      |
| Tamanho de entrada  | 224 × 224 pixels             |
| Tipo de tarefa      | Classificação de imagens     |

**Por que MobileNet v2?**  
MobileNet v2 é uma rede leve e eficiente, projetada para rodar em dispositivos com recursos limitados (mobile, CPU). Ela usa *depthwise separable convolutions* para reduzir o custo computacional mantendo boa acurácia — ideal para inferência em tempo real no navegador.

**O que é Transfer Learning?**  
Em vez de treinar uma rede do zero (o que exigiria milhares de imagens e horas de processamento), o Teachable Machine parte de um MobileNet já treinado no dataset ImageNet e retreina apenas as camadas finais com as imagens fornecidas. Isso permite criar um classificador funcional com poucas dezenas de fotos por classe.

---

## Classes Reconhecidas

O modelo foi treinado para identificar **4 categorias de alimentos**:

| Emoji | Classe       | Descrição                        |
|-------|--------------|----------------------------------|
| 🍣    | Sushi        | Peças de sushi e similares       |
| 🍕    | Pizza        | Fatias ou pizzas inteiras        |
| 🍔    | Hamburguer   | Hambúrgueres e sanduíches        |
| 🍦    | Sorvete      | Sorvetes em casquinha ou copo    |

---

## Estrutura de Arquivos

```
ProjetoC2Alimentos/
│
├── index.html                  # Estrutura HTML da aplicação
│
├── css/
│   └── style.css               # Estilos e layout da interface
│
├── js/
│   └── app.js                  # Lógica principal: modelo, câmera e predição
│
└── tm-my-image-model/          # Modelo exportado do Teachable Machine
    ├── model.json              # Arquitetura e pesos do modelo (metadados TF.js)
    ├── metadata.json           # Labels das classes e configurações
    └── weights.bin             # Pesos binários da rede neural
```

### Responsabilidade de cada arquivo

- **`index.html`** — Apenas a marcação HTML. Não contém CSS inline nem scripts de lógica.
- **`css/style.css`** — Todo o visual: layout em grid, cards, barras de progresso, animações, responsividade.
- **`js/app.js`** — Carrega o modelo TF.js, inicializa a webcam, executa o loop de predição e atualiza a interface.
- **`tm-my-image-model/`** — Modelo exportado diretamente do Teachable Machine, carregado localmente sem depender de nenhuma API externa.

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [TensorFlow.js](https://www.tensorflow.org/js) | 1.3.1 | Inferência da rede neural no navegador |
| [Teachable Machine Image](https://teachablemachine.withgoogle.com/) | 0.8 | Wrapper de alto nível para carregar e usar o modelo |
| HTML5 | — | Estrutura da página |
| CSS3 | — | Estilização e layout |
| JavaScript (ES2017+) | — | Lógica da aplicação com `async/await` |

Todas as dependências são carregadas via CDN — nenhum `npm install` necessário.

---

## Como Executar

> **Atenção:** o navegador exige contexto seguro (`https://` ou `localhost`) para acessar a câmera. Abrir o `index.html` diretamente pelo sistema de arquivos (`file://`) **não funciona**.

### Opção 1 — Python (recomendado, sem instalação extra)

```bash
# Na pasta do projeto:
python -m http.server 8000
```

Depois acesse: [http://localhost:8000](http://localhost:8000)

### Opção 2 — Node.js com `serve`

```bash
npx serve .
```

Depois acesse o endereço exibido no terminal (geralmente `http://localhost:3000`).

### Opção 3 — VS Code Live Server

1. Instale a extensão **Live Server** (Ritwick Dey)
2. Clique com o botão direito em `index.html`
3. Selecione **"Open with Live Server"**

### Opção 4 — Node.js com `http-server`

```bash
npm install -g http-server
http-server . -p 8000
```

---

## Como Funciona

### Fluxo de execução

```
Página carrega
     │
     ▼
loadModel()
  └─ tmImage.load(model.json, metadata.json)
  └─ Constrói os cards de classe na interface
  └─ Habilita o botão "Iniciar"
     │
     ▼
Usuário clica em "Iniciar"
     │
     ▼
startCamera()
  └─ tmImage.Webcam(224, 224, flip=false)
  └─ webcam.setup() → pede permissão ao navegador
  └─ webcam.play()  → inicia o stream de vídeo
  └─ Inicia loop()
     │
     ▼
loop() — requestAnimationFrame
  └─ webcam.update()   → captura o frame atual
  └─ predict()
       └─ model.predict(webcam.canvas)
       └─ Encontra a classe com maior probabilidade
       └─ Atualiza barras, percentuais e overlay
  └─ Reagenda com requestAnimationFrame
```

### Detalhes da predição (`app.js`)

```js
async function predict() {
  const predictions = await model.predict(webcam.canvas);
  const top = predictions.reduce((a, b) => a.probability > b.probability ? a : b);

  // Atualiza cada card com a probabilidade correspondente
  predictions.forEach(p => { ... });

  // Mostra no overlay apenas se confiança > 30%
  if (top.probability > 0.3) {
    topName.textContent = top.className;
    ...
  }
}
```

O limiar de **30% de confiança** evita que a interface mostre uma classe de forma assertiva quando o modelo está inseguro (por exemplo, quando nenhum alimento reconhecível está na câmera).

---

## Interface

A interface é dividida em dois painéis:

### Painel esquerdo — Câmera
- Feed da webcam em tempo real (espelhado)
- Overlay inferior com a **classe detectada**, emoji correspondente e percentual de confiança
- Botões para iniciar e parar a câmera
- Barra de status com indicador visual (amarelo = carregando, verde = ativo, vermelho = erro)

### Painel direito — Resultados
- **Cards por classe:** mostram o percentual e uma barra de progresso para cada um dos 4 alimentos
- A classe com maior probabilidade é destacada com borda e cor diferente
- **Card de informações técnicas:** exibe os metadados do modelo (arquitetura, framework, tamanho de entrada)

### Responsividade
Em telas menores que 768px, o layout passa de duas colunas para uma coluna empilhada verticalmente.

---

## Modelo Treinado

O modelo foi treinado diretamente na plataforma **Google Teachable Machine** ([teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com)) e exportado no formato **TensorFlow.js** para uso local.

| Campo | Valor |
|---|---|
| Nome do modelo | `tm-my-image-model` |
| Data de criação | 28/03/2026 |
| Versão TM | 2.4.12 |
| Versão TF.js | 1.7.4 |
| Tamanho de entrada | 224 × 224 px |
| Número de classes | 4 |
| Labels | Sushui, Pizza, Hamburguer, Sorvete |

O modelo é carregado inteiramente no cliente (navegador), sem nenhuma chamada a servidor externo durante a inferência. Isso garante funcionamento offline após o carregamento inicial da página.

---

*Projeto desenvolvido para a disciplina de Robótica e Sistemas Inteligentes — FAESA, 2026.*
