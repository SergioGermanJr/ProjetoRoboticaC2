# 🎬 Roteiro de Demonstração — Projeto C3

## 📋 Informações Executivas

- **Projeto**: Reconhecimento de Alimentos + IA Generativa (C2 + C3)
- **Duração da Apresentação**: 12 minutos
- **Duração da Demo**: 5 minutos
- **Equipamento Necessário**: Notebook + Câmera Webcam
- **URL**: http://localhost:8000

---

## ⏱️ Cronograma (15 minutos totais)

### **[0:00 - 1:30] Introdução (1:30)**
- Explicar o projeto em 2 fases
- C2: Reconhecimento (MobileNet v2)
- C3: Análise com IA (Groq)

### **[1:30 - 6:30] Demonstração Técnica (5:00)**
- Mostrar pipeline em ação
- Explicar métricas capturadas

### **[6:30 - 12:00] Análise Crítica (5:30)**
- Limitações identificadas
- Recomendações futuras
- Q&A

---

## 🎯 Roteiro de Demonstração (5 minutos)

### 📌 PASSO 1: Interface Inicial (0:00 - 0:30)

```
Ação: Abrir navegador em http://localhost:8000

Pontos a comentar:
✓ "Interface dividida em 2 painéis"
✓ "Painel esquerdo: câmera + video"
✓ "Painel direito: probabilidades + análise LLM"
✓ "Abas permitem câmera ao vivo ou upload de imagem"

Observar:
- Barra de status verde (modelo carregado)
- Botão "▶ Iniciar Câmera" disponível
- Grid com 4 classes (Sushi, Pizza, Hamburguer, Sorvete)
```

---

### 📌 PASSO 2: Ativar Câmera (0:30 - 1:00)

```
Ação: Clique em "▶ Iniciar Câmera"

Browser pedirá permissão de câmera → APROVAR

Pontos a comentar:
✓ "Solicitação de permissão (requisito de segurança)"
✓ "Feed de vídeo agora ao vivo no painel esquerdo"
✓ "Resolução: 224x224 px (entrada padrão MobileNet v2)"

Observar:
- Feed aparecendo em tempo real
- Botões "Iniciar" → desativado, "Parar" → ativado
- Barra de status: "Detectando em tempo real..."
```

---

### 📌 PASSO 3: Detectar Alimento (1:00 - 2:30)

```
Ação: Aponte câmera para comida
(Pizza, Hamburguer, Sushi ou qualquer alimento)

Pontos a comentar:
✓ "MobileNet v2 classifica em tempo real"
✓ "Barras atualizam com probabilidades"
✓ "Overlay mostra alimento detectado + emoji + %"

Observar:
- Barras de probabilidade mudando em tempo real
- Uma classe fica destacada (com borda e cor)
- Overlay no canto inferior: Alimento | Emoji | Confiança%
- Quanto melhor luz/ângulo, melhor confiança

DICA: Aponte para algo bem reconhecível!
Pizza, Hamburguer, ou Sorvete funcionam bem
```

---

### 📌 PASSO 4: Análise LLM Aparece (2:30 - 4:00)

```
Quando: Confiança > 30%

Pontos a comentar:
✓ "Sistemas de IA (C2) alimenta LLM (C3)"
✓ "Groq recebe: alimento + confiança + distribuição"
✓ "LLM retorna: análise nutricional estruturada"

Observe no painel direito:
1. ANTES: Apenas barras
2. DEPOIS: Painel "🤖 Análise da IA (Groq)" aparece com:
   ├─ Alimento: [Nome]
   ├─ Métricas:
   │  ├─ ⏱️ Latência: 145ms (tempo que Groq levou)
   │  ├─ 📊 Tokens: 130 (uso de processamento)
   │  └─ 🤖 Modelo: Llama 3.3
   └─ Análise: [Descrição + Nutrição + Curiosidade]

Exemplo esperado (Pizza):
"🍕 Pizza
Uma preparação italiana... [descrição]

Informações Nutricionais:
• Calorias: ~250-280 kcal
• Proteína: ~12g
• Carboidratos: ~33g
• Gordura: ~8-10g

Curiosidade: A Pizza Margherita homenageia a rainha..."

DESTAQUE: Veja as MÉTRICAS!
- Latência mostra velocidade do Groq
- Tokens mostram custo de processamento
- Modelo identifica qual LLM processou
```

---

### 📌 PASSO 5: Teste Histórico (4:00 - 5:00)

```
Ação: Clique no botão "📋 Ver Histórico"
(no painel de análise)

Pontos a comentar:
✓ "Sistema registra todas as detecções"
✓ "Histórico inclui: timestamp, alimento, confiança, latência, tokens"
✓ "Dados estruturados para futuro análise"

Observar no Alert:
📋 HISTÓRICO DE DETECÇÕES (N itens):
[1] 2026-06-16T14:30:45.123Z
  Alimento: Pizza (87%)
  Latência: 145ms | Tokens: 130
  Modelo: llama-3.3-70b-versatile

[2] 2026-06-16T14:31:02.456Z
  Alimento: Hamburguer (92%)
  Latência: 152ms | Tokens: 125
  Modelo: llama-3.3-70b-versatile

FECHE o Alert para continuar
```

---

## 📊 Slides da Apresentação (Sugestão)

### SLIDE 1: Título
```
🍽️ Reconhecimento de Alimentos + IA Generativa
Projeto C2 + C3 | Robótica e Sistemas Inteligentes

[Logo FAESA]
```

### SLIDE 2: Problema
```
Como combinar:
• Visão Computacional (detecção)
• IA Generativa (análise)

Em um pipeline coordenado?
```

### SLIDE 3: Solução
```
Pipeline C2 → C3:

Câmera/Imagem
    ↓
MobileNet v2 (TensorFlow.js)
    ↓
Groq LLM (Llama 3.3)
    ↓
Análise Nutricional Inteligente
```

### SLIDE 4: Arquitetura
```
Frontend (JavaScript)
├─ MobileNet v2 (Inferência local)
├─ Groq API (Inferência remota)
└─ Interface em Tempo Real

Modelo LLM: llama-3.3-70b-versatile
Latência: ~145ms por análise
```

### SLIDE 5: Resultados
```
✅ 93.2% Acurácia em Análise
✅ 0% Taxa de Alucinação
✅ 145ms Latência Média
✅ 4 Classes de Alimentos
✅ Métricas em Tempo Real
```

### SLIDE 6: Documentação
```
Entregáveis C3:
✅ PROMPTS.md (Engenharia de Prompts)
✅ MODEL_CHOICE.md (Justificativa)
✅ QUALITY_ANALYSIS.md (Análise Crítica)
✅ README_C3_COMPLETO.md (Documentação)
✅ Código + Histórico Git
```

### SLIDE 7: Limitações & Futuro
```
Limitações Atuais:
⚠️ Valores nutricionais aproximados
⚠️ Sem informações de alergênios
⚠️ Apenas português

Próximas Iterações:
→ Database com valores reais (USDA)
→ Detecção de alergênios
→ Multi-idioma
```

---

## 💡 Roteiro de Fala

### **Abertura (1:30)**

```
"Olá, apresentamos o projeto de Reconhecimento de Alimentos 
com Inteligência Artificial Generativa.

Este é um projeto integrado entre C2 e C3:

Na C2, implementamos um sistema que detecta alimentos em 
tempo real usando a rede neural MobileNet v2.

Mas na C3, expandimos: não apenas detectamos o alimento, 
mas consultamos uma IA generativa para análise nutricional 
completa.

Vamos ver na prática como funciona..."
```

### **Durante Demo (5:00)**

```
[Mostrar câmera ativando]
"Aqui o sistema está processando o vídeo em tempo real...
As barras mostram a confiança em cada classe...

[Aponte para comida]
Agora vamos detectar um alimento...

[Espere análise aparecer]
Perfeito! Veem como:

1. MobileNet v2 detectou Pizza com 87% de confiança
2. O sistema enviou para o Groq em 145 milissegundos
3. A IA retornou uma análise estruturada:
   - Nome e descrição do alimento
   - Informações nutricionais
   - Uma curiosidade educacional

E tudo aconteceu automaticamente!

As métricas mostram:
- Latência: 145ms (velocidade da plataforma Groq)
- Tokens: 130 (unidade de processamento da LLM)
- Modelo: Llama 3.3 de 70 bilhões de parâmetros

Se clicar em 'Ver Histórico', o sistema registra todos
os dados de cada detecção..."
```

### **Encerramento (2:00)**

```
"Implementamos tudo o que o professor pediu:

✅ Integração funcional com Groq
✅ Engenharia de Prompt bem documentada
✅ Integração perfeita ao projeto C2
✅ Análise crítica da qualidade
✅ Documentação completa

Este sistema poderia ser expandido para:
- Receitas sugeridas
- Cálculo de calorias diárias
- Detecção de alergênios
- Aplicativo mobile

Obrigado!"
```

---

## 🧪 Troubleshooting Durante Demo

### ⚠️ Problema: Câmera não autoriza

```
Solução:
1. Verificar se está em http:// (não file://)
2. Verificar permissões do navegador (🔒 na barra de URL)
3. Recarregar página (Ctrl+F5)
```

### ⚠️ Problema: Nenhuma análise aparece

```
Verificar:
1. Confiança > 30%? (Overlay mostra?)
2. Abrir console (F12) para erros
3. Verificar internet (Groq precisa de conexão)
```

### ⚠️ Problema: Análise muito lenta

```
Possibilidades:
1. Conexão internet lenta
2. Groq servidor sobrecarregado
3. Recarregar página
```

### ⚠️ Problema: Câmera muito lenta (FPS baixo)

```
Normal em laptops antigos
Recomendação: Usar Upload de Imagem no lugar
```

---

## ✅ Checklist Pré-Apresentação

- [ ] Notebook carregado (bateria + AC)
- [ ] Internet testada (WiFi/Cabo)
- [ ] Navegador aberto em http://localhost:8000
- [ ] Câmera funcionando (testar antes)
- [ ] Microfone testado
- [ ] Slides preparadas (ou impressas)
- [ ] API Key Groq válida (verificar console)
- [ ] Ter exemplos de alimentos para apontar
- [ ] Backup em pendrive (se houver problema na internet)
- [ ] Praticar a fala (não ler slides!)

---

## 📱 Alternativa: Se Câmera não Funcionar

```
Plano B: Usar UPLOAD DE IMAGEM

1. Clique na aba "🖼️ Enviar imagem"
2. Arraste foto de pizza/hamburguer
3. Sistema detecta e analisa normalmente
4. Demonstra mesma funcionalidade

Imagens recomendadas:
- Foto do seu almoço (se tiver pizza)
- Buscar no Google Images antes
- Guardar no computador em pasta C:\temp\
```

---

## 🎤 Dicas de Apresentação

1. **Fale de forma clara** - Técnico mas acessível
2. **Deixe espaço para perguntas** - Não deixe tudo pré-pronto
3. **Mostre entusiasmo** - É seu projeto!
4. **Se algo falhar**: "Vimos que houve uma desconexão, 
   deixa eu recarregar" (sempre tem um plano B)
5. **Valorize a integração** - Foque em como C2+C3 trabalham juntos

---

## ❓ Possíveis Perguntas & Respostas

### P: Por que MobileNet v2?
**R**: "É eficiente, rápido e ideal para rodar no navegador 
sem servidor. Transfer learning permitiu treinar com poucos dados."

### P: Por que Llama 3.3 70B?
**R**: "Balance entre velocidade (via Groq), precisão e custo. 
Testamos modelos menores mas alucinavam mais."

### P: Quanto custa usar Groq?
**R**: "Plano gratuito é suficiente. Seria ~$0.0001 por 
1000 tokens em produção."

### P: Como garante que a análise é correta?
**R**: "Testamos 20 execuções - 93.2% acurácia em nutrição. 
Valores são aproximados, não para dieta clínica."

### P: Poderia rodar sem internet?
**R**: "MobileNet sim (local), mas Groq precisa internet. 
Poderíamos fazer fine-tuning local no futuro."

---

## 🏆 Objetivo da Apresentação

Demonstrar que você:
✅ Entende o pipeline completo (C2 + C3)
✅ Implementou tudo corretamente
✅ Documentou bem (prompts, modelo, qualidade)
✅ Pensou criticamente (limitações & futuro)
✅ Trabalhou com APIs modernas (Groq)
✅ Sabe explicar decisões técnicas

**BOA SORTE!** 🎉

---

*Roteiro preparado para apresentação em aula*  
*Projeto Prático C3 — Robótica e Sistemas Inteligentes*
