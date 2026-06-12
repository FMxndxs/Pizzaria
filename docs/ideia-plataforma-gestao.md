# Ideia: Plataforma Própria de Gestão para Restaurantes

> Status: **Discussão — não iniciada**
> Registrado em: 2026-06-12
> Motivação: dChef (sistema atual do cliente) não possui API pública nem importação externa, impossibilitando integração técnica direta.

---

## O que seria o produto

Uma plataforma SaaS multi-tenant de gestão para pizzarias/restaurantes brasileiros, com os mesmos módulos do dChef mas integrada nativamente ao projeto pizzaria e extensível para novos clientes.

---

## Escopo do produto

**Core obrigatório:**
- PDV (balcão, mesa, delivery)
- KDS — fila de produção em tempo real para a cozinha
- Cardápio dinâmico com variações, complementos, adicionais
- Gestão de pedidos com ciclo de vida completo
- Caixa — abertura, fechamento, formas de pagamento, sangria
- Relatórios financeiros básicos (DRE simplificado, ticket médio, produtos mais vendidos)

**Camada de integração (diferencial):**
- API própria que o site da pizzaria consumiria nativamente — fim da Camada 3 (cópia manual)
- Webhook para notificações em tempo real
- Futuramente: integração com iFood, Rappi, Uber Eats

**Infraestrutura:**
- Multi-tenancy desde o dia 1 (cada pizzaria é um tenant isolado)
- Autenticação com perfis: dono, gerente, atendente, cozinheiro
- Impressão de comanda via rede local (protocolo ESC/POS)

---

## Vantagens

**Estratégicas:**
- Controle total do roadmap — sem dependência de fornecedor externo
- Integração nativa com o site do cliente (zero fricção, zero Camada 3)
- Modelo de negócio próprio: mensalidade por tenant
- Reaproveitamento da stack já dominada (Next.js, Supabase, TypeScript)
- Cada cliente novo é receita incremental com custo marginal baixo

**Técnicas:**
- API pública própria — integrações futuras (iFood, apps mobile) ficam simples
- Dados 100% próprios — analytics, histórico completo
- Sem limitações artificiais de plano

---

## Estimativa de Esforço

| Fase | O que cobre | Tempo estimado |
|------|-------------|----------------|
| Fundação | Multi-tenancy, auth, estrutura de banco | 3-4 semanas |
| KDS + pedidos | Fila de produção, WebSockets, status | 3-4 semanas |
| PDV | Interface de atendimento, impressão | 6-8 semanas |
| Financeiro | Caixa, pagamentos, relatórios | 4-6 semanas |
| Cardápio admin | CRUD completo com variações | 2-3 semanas |
| Integração site | API consumida pelo projeto pizzaria | 1-2 semanas |
| **Total** | | **~5 a 8 meses** |

**Infraestrutura mensal (até 10 clientes):**
- Supabase Pro: ~$25/mês
- Vercel Pro: ~$20/mês
- Total: menos de $100/mês

---

## Preocupações Sérias

**1. Impressão de comanda**
Impressoras térmicas ESC/POS em rede local não se comunicam com browsers por segurança. Soluções possíveis: app Electron local, servidor Node na máquina do cliente, ou QZ Tray. Cada uma tem fricção de instalação.

**2. Conformidade fiscal**
NFC-e, SAT, CF-e dependendo do estado. Se clientes precisarem emitir nota fiscal eletrônica, o escopo explode — meses de trabalho e custo de certificação.

**3. Confiabilidade em pico**
KDS caindo na sexta à noite com 20 pedidos simultâneos é crítico. Exige monitoramento, SLA e plano de contingência. Você vira o suporte de emergência.

**4. Suporte e manutenção**
Cada pizzaria que adotar gera tickets de suporte. É produto com usuários reais em ambiente de pressão.

**5. Competição**
dChef, Goomer, Anota AI, Sischef, GrandChef — mercado com players estabelecidos. Diferenciar exige proposta de valor clara e nicho bem definido.

---

## Pontos de Atenção

- **Multi-tenancy é decisão irreversível** — precisa ser a primeira decisão de arquitetura, antes de qualquer linha de código.
- **Não clonar o dChef — definir nicho** — pizzarias artesanais de delivery com site próprio é diferente de PDV genérico.
- **O site da pizzaria já é o MVP de um módulo** — catálogo, pedidos e admin já existem. A plataforma seria construída em torno disso.
- **Modelo de negócio define o escopo técnico** — mensalidade fixa, por transação ou freemium precisa ser decidido antes do v1.

---

## Avaliação Geral

| Dimensão | Avaliação |
|----------|-----------|
| Viabilidade técnica | Alta — stack já dominada |
| Esforço | Grande — 5 a 8 meses para algo utilizável |
| Risco técnico | Médio — impressão e fiscal são os maiores |
| Risco de negócio | Alto — mercado competitivo, suporte contínuo |
| Potencial de retorno | Alto — se nicho bem definido e base de clientes crescer |

---

## Estratégia de entrada recomendada

Usar o cliente da pizzaria atual como **cliente 0**:
1. Construir KDS + API de integração primeiro
2. Validar com o cliente antes de generalizar
3. Só depois migrar para arquitetura multi-tenant

Reduz risco e financia o próprio desenvolvimento.
