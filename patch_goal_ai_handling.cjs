const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenGoalAI.tsx', 'utf8');

const oldHandle = `          if (data.noSpeechDetected) {
            setErrorMsg("Nenhuma fala ou comando válido foi detectado.");
          } else {
            setDraftGoals((data.goals || []).slice(0, 20));
            if (data.limitExceeded || (data.goals && data.goals.length > 20)) {
              setErrorMsg("O assistente só consegue colocar 20 itens por vez. Por favor, salve estes 20 itens clicando no botão para que depois você possa continuar adicionando mais.");
            }
          }`;

const newHandle = `          if (data.noSpeechDetected) {
            setErrorMsg("Nenhuma fala ou comando válido foi detectado.");
          } else {
            if (data.unsupportedRequest) {
              setErrorMsg("Aviso de Capacidade: O assistente não tem suporte para algumas coisas que você pediu (como adicionar imagens, vídeos, etc). O restante que era possível, foi adicionado.");
            } else if (data.limitExceeded || (data.goals && data.goals.length > 20)) {
              setErrorMsg("O assistente só consegue colocar 20 itens por vez. Por favor, salve estes 20 itens clicando no botão para que depois você possa continuar adicionando mais.");
            }
            setDraftGoals((data.goals || []).slice(0, 20));
          }`;

code = code.replace(oldHandle, newHandle);
fs.writeFileSync('src/components/ScreenGoalAI.tsx', code);
console.log('Fixed ScreenGoalAI unsupported handling');
