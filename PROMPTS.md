# 🎯 Engenharia de Prompts — Projeto C3

## 📋 Índice
1. System Prompt
2. User Prompt
3. Justificativa das Escolhas
4. Testes de Temperatura
5. Iterações e Refinamentos

---

## 1️⃣ System Prompt (Definição de Papel)

```javascript
const SYSTEM_PROMPT = `Você é um especialista em alimentos e nutrição. 
Analise o alimento detectado e forneça:
1. Nome e descrição breve do alimento
2. Informações nutricionais principais (calorias, proteína, carboidratos, gordura aproximados)
3. Uma curiosidade ou fato interessante
Responda em português, de forma concisa (máximo 150 palavras).`;
```

### **Objetivo:**
- Estabelecer o **papel e contexto** da LLM
- Criar uma persona de especialista para respostas mais confiáveis
- Direcionar o formato e idioma da resposta
- Definir limites de tamanho (150 palavras)

### **Por que funciona:**
- ✅ Especialista em nutrição → Respostas mais precisas
- ✅ Português → Coerência com projeto
- ✅ Limite de palavras → Respostas não muito longas
- ✅ 3 pontos específicos → Estrutura clara

---

## 2️⃣ User Prompt (Contexto + Entrada)

```javascript
function buildUserPrompt(foodName, confidence, predictions) {
  const predictionData = predictions
    .map(p => `${p.className}: ${Math.round(p.probability * 100)}%`)
    .join(', ');
  
  return `O sistema de IA (MobileNet v2) detectou um alimento com ${Math.round(confidence * 100)}% de confiança.
Alimento principal: ${foodName}
Distribuição de confiança: ${predictionData}

Forneça uma análise rápida e útil sobre este alimento.`;
}
```

### **Estrutura:**
1. **Contexto do sistema**: "MobileNet v2" (identifica a origem dos dados)
2. **Confiança da predição**: % de certeza (credibilidade)
3. **Distribuição completa**: Todas as classes e probabilidades
4. **Instrução clara**: "análise rápida e útil"

### **Exemplo de Saída do User Prompt:**
```
O sistema de IA (MobileNet v2) detectou um alimento com 87% de confiança.
Alimento principal: Pizza
Distribuição de confiança: Pizza: 87%, Hamburguer: 8%, Sushi: 3%, Sorvete: 2%

Forneça uma análise rápida e útil sobre este alimento.
```

---

## 3️⃣ Justificativa das Escolhas

| Aspecto | Escolha | Razão |
|--------|--------|-------|
| **Temperatura** | 0.3 | Baixa = respostas determinísticas e confiáveis (não criativas demais) |
| **Max Tokens** | 300 | Limite suficiente para nutrição + curiosidade sem overflow |
| **Idioma** | Português | Alinhado com projeto e usuários |
| **Contexto do modelo** | MobileNet v2 | Transparência sobre origem dos dados |
| **Distribuição completa** | Todas as classes | Permite à LLM contextualizar alternativas |
| **Limite de palavras** | 150 | Conciso mas informativo |

---

## 4️⃣ Testes de Temperatura

### Teste 1: Temperature = 0.0 (Mínima - Determinístico)
- ✅ Respostas previsíveis
- ✅ Sem alucinações
- ❌ Muito robótico
- ❌ Falta de nuance

### Teste 2: Temperature = 0.3 ✅ **ESCOLHIDO**
- ✅ Bom equilíbrio entre criatividade e confiabilidade
- ✅ Respostas naturalistas
- ✅ Informações precisas
- ✅ Curiosidades interessantes

### Teste 3: Temperature = 0.7 (Alta)
- ✅ Mais criatividade
- ❌ Risco de informações imprecisas
- ❌ Alucinações sobre nutrição
- ❌ Não adequado para informações factual

**Conclusão**: 0.3 é o melhor balance para análise nutricional.

---

## 5️⃣ Iterações e Refinamentos

### **Iteração 1** (Inicial)
```javascript
// ❌ Fraco
userPrompt = `Alimento: ${foodName}
Confiança: ${confidence * 100}%
Analise este alimento.`;
```
**Problema**: Muito vago, sem contexto técnico

### **Iteração 2** (Melhorado)
```javascript
// ⚠️ Melhor
userPrompt = `Sistema detectou: ${foodName}
Confiança: ${confidence * 100}%
Forneça informações nutricionais.`;
```
**Problema**: Ainda falta contexto das alternativas

### **Iteração 3** (Atual) ✅
```javascript
// ✅ Ótimo
userPrompt = `O sistema de IA (MobileNet v2) detectou um alimento com ${confidence * 100}% de confiança.
Alimento principal: ${foodName}
Distribuição de confiança: ${predictionData}
Forneça uma análise rápida e útil sobre este alimento.`;
```
**Melhorias**:
- Transparência sobre origem (MobileNet v2)
- Contexto de confiabilidade
- Alternativas mostradas (predicionData)
- Instrução clara

---

## 📊 Impacto no Pipeline

```
Imagem/Câmera
    ↓
MobileNet v2 (Predição: alimento + classes alternativas)
    ↓
applyPredictions() 
    ↓
callGroqAPI(foodName, confidence, predictions)
    ↓
System Prompt (papel de especialista) +
User Prompt (contexto + dados da C2)
    ↓
Groq LLM (llama-3.3-70b-versatile)
    ↓
Analysis → displayGroqAnalysis()
    ↓
UI: Exibe análise + métricas (latência, tokens)
```

---

## 🎓 Boas Práticas Aplicadas

✅ **Prompt Engineering**
- System prompt define persona clara
- User prompt estruturado com contexto
- Limite de tokens definido
- Temperature apropriada para tarefa

✅ **Transparência**
- Identificação de origem de dados (MobileNet v2)
- Distribuição de confiança completa
- Métricas visíveis (latência, tokens consumidos)

✅ **Qualidade**
- Respostas concisas (150 palavras)
- Informações nutricionais verificáveis
- Curiosidades educacionais

✅ **Tratamento de Erros**
- Validação de API Key
- Timeout configurado
- Feedback ao usuário

---

## 🔄 Manutenção e Futuro

### Possíveis Ajustes:
1. Incluir alergênios comuns
2. Adicionar receitas sugeridas
3. Comparar valores nutricionais com recomendações diárias
4. Modo multi-idioma

### Monitoring:
- Tokens consumidos por requisição
- Latência média de resposta
- Taxa de sucesso das chamadas
- Satisfação com precisão das respostas

---

**Documento gerado para fins de avaliação — Projeto Prático C3**
