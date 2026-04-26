export const questionGroups = [
  {
    axis: 'proposto',
    label: 'Proposto',
    color: '#6aa8ff',
    items: [
      ['q1','Clareza da promessa de valor','O cliente entende a transformação prometida?','Nada claro','Muito claro',8],
      ['q2','Aderência ao problema real','A proposta está conectada à dor atual?','Pouco conectada','Muito conectada',7],
      ['q3','Relevância percebida da promessa','Essa proposta parece relevante para o momento atual do cliente?','Pouco relevante','Muito relevante',8]
    ]
  },
  {
    axis: 'entregue',
    label: 'Entregue',
    color: '#61d48b',
    items: [
      ['q4','Entrega operacional recorrente','O produto entrega consistentemente?','Inconsistente','Consistente',6],
      ['q5','Evidências de acompanhamento','Existem marcos, relatórios ou checkpoints?','Sem evidências','Evidências claras',6],
      ['q6','Capacidade de sustentação da entrega','A operação sustenta essa entrega ao longo do tempo?','Difícil sustentar','Fácil sustentar',5]
    ]
  },
  {
    axis: 'percebido',
    label: 'Percebido',
    color: '#b16cff',
    items: [
      ['q7','Percepção de progresso','O cliente percebe evolução por causa do produto?','Não percebe','Percebe claramente',4],
      ['q8','Reconhecimento do valor','O cliente reconhece o valor do que recebe?','Não reconhece','Reconhece fortemente',5],
      ['q9','Facilidade de justificar a renovação','O cliente conseguiria explicar por que vale a pena continuar?','Não justificaria','Justificaria com clareza',4]
    ]
  }
];

export const attentionCatalog = {
  q1:['Clareza da promessa abaixo do ideal','Reescreva a promessa em linguagem simples e conectada à transformação esperada.'],
  q2:['Aderência ao problema real fragilizada','Atualize a dor dominante do cliente antes de conversar sobre renovação.'],
  q3:['Relevância percebida da promessa baixa','Mostre custo de não agir, riscos e oportunidades concretas.'],
  q4:['Entrega operacional oscilando','Padronize a entrega e corrija gargalos antes de ampliar promessa.'],
  q5:['Evidências de acompanhamento insuficientes','Crie relatórios, checkpoints e registros simples de evolução.'],
  q6:['Sustentação da entrega frágil','Revise capacidade operacional, responsáveis e escopo prometido.'],
  q7:['Percepção de progresso abaixo do equilíbrio','O cliente não está percebendo claramente a evolução entregue.'],
  q8:['Reconhecimento do valor insuficiente','O valor gerado não está sendo reconhecido como relevante.'],
  q9:['Justificativa de renovação frágil','O cliente pode ter dificuldade para justificar a continuidade.']
};

export const scenarioLibrary = {
  invisivel:{title:'Valor invisível',text:'A entrega e a proposta existem, mas o cliente ainda percebe menos valor do que recebe.',actions:['Criar checkpoints de evolução','Enviar devolutivas e evidências de valor','Preparar argumento de renovação','Envolver mentor ou decisor na leitura de valor']},
  sobrepromessa:{title:'Risco de sobrepromessa',text:'A promessa puxa o ponto real mais do que a entrega e a percepção. Existe risco de expectativa acima da operação.',actions:['Revisar promessa comercial','Alinhar expectativa antes da renovação','Transformar promessa em marcos entregáveis','Corrigir gargalos operacionais']},
  propostaFraca:{title:'Produto bom, proposta fraca',text:'A experiência pode existir, mas a proposta não comunica com força o valor estratégico.',actions:['Reposicionar proposta de valor','Melhorar narrativa comercial','Conectar entrega a objetivos maiores','Preparar material executivo de renovação']},
  percepcaoAlta:{title:'Percepção favorável',text:'O cliente percebe valor, mas a entrega ou a proposta precisam sustentar essa percepção no próximo ciclo.',actions:['Aproveitar janela de renovação','Documentar entregas reais','Fortalecer sustentação operacional','Evitar expansão agressiva sem base']},
  alinhado:{title:'Valores alinhados',text:'O ponto real está próximo do baricentro. O foco é manter equilíbrio e elevar a maturidade.',actions:['Antecipar conversa de renovação','Apresentar evolução acumulada','Sugerir expansão controlada','Mapear próximos objetivos']},
  baixo:{title:'Equilíbrio baixo',text:'Os valores estão relativamente alinhados, mas em nível absoluto baixo. O problema é estrutural, não apenas de distância.',actions:['Revisar proposta completa','Entrevistar cliente sobre valor real','Redesenhar jornada','Corrigir entregas críticas']}
};
