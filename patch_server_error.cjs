const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldCatch = `    } catch (error: any) {
      console.error('Error generating goal parsing:', error);
      res.status(500).json({ error: 'Failed to process AI goal request' });
    }`;

const newCatch = `    } catch (error: any) {
      console.error('Error generating goal parsing:', error);
      const isQuotaError = error.message?.includes("429") || error.message?.includes("exceeded your current quota");
      const isMinuteLimit = error.message?.toLowerCase().includes("per minute") || error.message?.toLowerCase().includes("requests per minute");
      
      let errorMsg = error.message;
      if (isQuotaError) {
        errorMsg = isMinuteLimit ? "Limite de requisições por minuto excedido." : "Cota total da API excedida.";
      } else if (error.message?.includes("503") || error.message?.includes("high demand")) {
        errorMsg = "Serviço temporariamente indisponível. Tente novamente.";
      }
      res.status(isQuotaError ? 429 : (error.message?.includes("503") ? 503 : 500)).json({ 
        error: errorMsg,
        isMinuteLimit: isQuotaError && isMinuteLimit,
        isQuotaError
      });
    }`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('server.ts', code);
console.log('Fixed error handling in server.ts');
