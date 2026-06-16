# 🚀 Integração Groq - Projeto C3

Este documento guia você pelas etapas para configurar e testar a integração da LLM Groq ao projeto C2.

## ✅ O que foi feito automaticamente

- ✨ Função `callGroqAPI()` adicionada em `js/app.js`
- 🎨 Painel de análise LLM criado na UI (`index.html`)
- 🎭 Estilos CSS para o painel adicionados
- 📄 Arquivo de configuração `config.js` criado
- 🔐 Arquivo `.gitignore` configurado para proteger credenciais

## 🔑 Passo 1: Obter sua API Key do Groq

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma conta gratuita (ou faça login)
3. Navegue até **API Keys** no menu lateral
4. Clique em **Create API Key**
5. Dê um nome (ex: "ProjetoC3")
6. **Copie a chave** — ela aparece apenas uma vez!

## 🔐 Passo 2: Configurar a API Key

Abra o arquivo `config.js` e substitua:

```javascript
const GROQ_CONFIG = {
  apiKey: 'sua_api_key_aqui', // ← COLE SUA CHAVE AQUI
  ...
};
```

Por:

```javascript
const GROQ_CONFIG = {
  apiKey: 'gsk_sua_chave_real_aqui', // ← SUA CHAVE REAL
  ...
};
```

⚠️ **IMPORTANTE:** O `.gitignore` já está configurado para não fazer commit de `config.js`, então sua chave fica segura.

## 🎬 Passo 3: Testar o Sistema

1. Abra `index.html` no navegador (ou use `python -m http.server`)
2. Clique em **"Iniciar Câmera"** ou envie uma imagem
3. Quando um alimento é detectado (>30% confiança):
   - O sistema automaticamente chama a API Groq
   - Uma análise aparece no painel direito ("🤖 Análise da IA")

## 📊 O que acontece no pipeline

```
Câmera / Imagem
    ↓
TensorFlow.js (Modelo C2)
    ↓
Detecção do alimento (MobileNet v2)
    ↓
Confiança > 30% ?
    ↓ SIM
callGroqAPI(foodName, confidence)
    ↓
API Groq (Llama 3.3)
    ↓
Análise interpretativa
    ↓
Exibe no painel UI
```

## 🛠️ Solução de Problemas

### Erro: "Groq API Key não configurada"
- Verifique se `config.js` tem a chave real (não "sua_api_key_aqui")
- Recarregue a página após editar `config.js`

### Erro 401 (Unauthorized)
- A chave está incorreta ou expirou
- Gere uma nova chave em [console.groq.com/keys](https://console.groq.com/keys)

### Erro 429 (Rate Limited)
- Você fez muitas requisições rapidamente
- O sistema tem proteção (espera 2s entre chamadas)
- Aguarde alguns minutos

### Nada aparece no painel de análise
- Verifique o **console do navegador** (F12) para erros
- Certifique-se de que a confiança é > 30%
- Tente com uma imagem de alimento claramente reconhecível

## 📝 Prompts Utilizados

### System Prompt (Define o papel da IA)
```
Você é um especialista em alimentos e nutrição. Analise o alimento detectado e forneça:
1. Nome e descrição breve do alimento
2. Informações nutricionais principais
3. Uma curiosidade ou fato interessante
Responda em português, de forma concisa (máximo 150 palavras).
```

### User Prompt (Solicita análise)
```
O sistema de IA detectou um alimento com {confiança}% de confiança.
Alimento: {nome}

Forneça uma análise rápida e útil sobre este alimento.
```

## 🎯 Parâmetros de Configuração

Edite `callGroqAPI()` em `js/app.js` para ajustar:

```javascript
temperature: 0.3,    // 0 = determinístico, 1 = criativo
max_tokens: 300,     // Limite de comprimento da resposta
GROQ_DEBOUNCE_MS: 2000  // Tempo mínimo entre chamadas
```

## 📚 Modelos Disponíveis no Groq

Você pode escolher em `config.js`:

```javascript
modelId: 'llama-3.3-70b-versatile',  // ← Padrão (recomendado)
// Alternativas:
// 'llama-3.1-8b-instant'    (mais rápido, menos preciso)
// 'mixtral-8x7b-32768'
// 'gemma2-9b-it'
// 'deepseek-r1-distill-llama-70b'
```

## ✨ Funcionalidades Implementadas

- ✅ Detecção de alimentos em tempo real (TensorFlow.js)
- ✅ Chamada automática à IA Groq
- ✅ Análise interpretativa em português
- ✅ Painel dinâmico com a resposta da LLM
- ✅ Tratamento de erros com feedback visual
- ✅ Debouncing para evitar chamadas repetidas
- ✅ Spinner de carregamento durante a análise

## 🔄 Fluxo de Dados (Diagrama)

```
┌─────────────────────┐
│ Camera / File Input  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  TensorFlow.js + Teachable Machine  │
│       (Modelo C2 - MobileNet v2)    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│ Classificação 4 alimentos│
│   (Sushi, Pizza, etc)   │
└──────────┬──────────────┘
           │
      Confiança > 30% ?
           │
        ───┴────────────────────┐
        │                       │
       NÃO                      SIM
        │                       │
        ▼                       ▼
   Aguardando...      ┌──────────────────────┐
                      │  callGroqAPI()       │
                      │  (js/app.js)         │
                      └──────────┬───────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │   GROQ API Call      │
                      │  (fetch + bearer)    │
                      └──────────┬───────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │ Llama 3.3 LLM        │
                      │ (análise)            │
                      └──────────┬───────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │ displayGroqAnalysis()│
                      │ (atualiza painel UI) │
                      └──────────────────────┘
```

## 📞 Suporte

- 📖 Docs Groq: [console.groq.com/docs](https://console.groq.com/docs)
- 🐛 Problemas? Verifique o console do navegador (F12)
- 💡 Ideias? Edite os prompts em `callGroqAPI()`

---

**Criado em C3 — Robótica e Sistemas Inteligentes | 2026**
