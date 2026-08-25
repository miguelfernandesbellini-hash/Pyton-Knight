(function () {
    'use strict';
    const RESTRICTED = ['print', 'input', 'int', 'if', 'elif', 'else', 'comparison', 'and', 'or', 'not', 'for', 'range', 'while', 'break'];
    const BUILTINS = new Set(['andar_frente', 'virar_direita', 'virar_esquerda', 'print', 'input', 'int', 'range']);
    class InterpreterError extends Error { constructor (cause, message, lineNumber) { super(message); this.name = 'InterpreterError'; this.cause = cause; this.lineNumber = lineNumber || null; } }
    function truthy (value) { return Boolean(value); }
    function numeric (left, right, line, label) { if (typeof left !== 'number' || typeof right !== 'number') throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, `${label} só pode combinar números.`, line); return [left, right]; }
    async function evaluate (scene, expression, context, line) {
        const T = window.GAME_CONSTANTS.TERMINOS;
        if (expression.type === 'literal') return expression.value;
        if (expression.type === 'variable') { if (!Object.prototype.hasOwnProperty.call(context.environment, expression.name)) throw new InterpreterError(T.SEMANTIC_ERROR, `Essa variável ainda não foi criada: ${expression.name}.`, line); return context.environment[expression.name]; }
        if (expression.type === 'unary') {
            const value = await evaluate(scene, expression.argument, context, line);
            if (expression.operator === 'not') return !truthy(value);
            if (typeof value !== 'number') throw new InterpreterError(T.SEMANTIC_ERROR, 'O sinal numérico só pode ser aplicado a números.', line);
            return expression.operator === '-' ? -value : value;
        }
        if (expression.type === 'binary') {
            if (expression.operator === 'and') { const left = await evaluate(scene, expression.left, context, line); return truthy(left) ? truthy(await evaluate(scene, expression.right, context, line)) : false; }
            if (expression.operator === 'or') { const left = await evaluate(scene, expression.left, context, line); return truthy(left) ? true : truthy(await evaluate(scene, expression.right, context, line)); }
            const left = await evaluate(scene, expression.left, context, line); const right = await evaluate(scene, expression.right, context, line);
            if (expression.operator === '+') { if ((typeof left === 'number' && typeof right === 'number') || (typeof left === 'string' && typeof right === 'string')) return left + right; throw new InterpreterError(T.SEMANTIC_ERROR, 'A soma precisa combinar dois números ou dois textos.', line); }
            if (['-', '*', '/'].includes(expression.operator)) { const values = numeric(left, right, line, expression.operator === '-' ? 'A subtração' : expression.operator === '*' ? 'A multiplicação' : 'A divisão'); if (expression.operator === '/' && right === 0) throw new InterpreterError(T.SEMANTIC_ERROR, 'Não é possível dividir por zero.', line); return expression.operator === '-' ? values[0] - values[1] : expression.operator === '*' ? values[0] * values[1] : values[0] / values[1]; }
            if (expression.operator === '==') return left === right;
            if (expression.operator === '!=') return left !== right;
            if (expression.operator === '>') return left > right;
            if (expression.operator === '<') return left < right;
            if (expression.operator === '>=') return left >= right;
            if (expression.operator === '<=') return left <= right;
        }
        if (expression.type === 'call') { const args = []; for (const argument of expression.args) args.push(await evaluate(scene, argument, context, line)); return window.DungeonSystem.callApi(scene, expression.name, args, { lineNumber: line, context }); }
        throw new InterpreterError(T.SEMANTIC_ERROR, 'A expressão não pôde ser interpretada.', line);
    }
    function tick (context, statement) { context.executedInstructions++; if (context.executedInstructions > window.GAME_CONSTANTS.LIMITES_EXECUCAO.MAX_INSTRUCOES) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.LOOP_GUARD_STOP, 'A execução ultrapassou o limite seguro.', statement.lineNumber); }
    async function executeBlock (scene, statements, context, insideLoop) {
        for (const statement of statements) {
            tick(context, statement);
            if (statement.type === 'assignment') {
                const value = await evaluate(scene, statement.expression, context, statement.lineNumber);
                if (statement.operator === '=') context.environment[statement.name] = value;
                else {
                    if (!Object.prototype.hasOwnProperty.call(context.environment, statement.name)) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, `Essa variável ainda não foi criada: ${statement.name}.`, statement.lineNumber);
                    const current = context.environment[statement.name]; const operator = statement.operator[0];
                    if (operator === '+') { if (!((typeof current === 'number' && typeof value === 'number') || (typeof current === 'string' && typeof value === 'string'))) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, 'A soma precisa combinar dois números ou dois textos.', statement.lineNumber); context.environment[statement.name] = current + value; }
                    else { const values = numeric(current, value, statement.lineNumber, operator === '-' ? 'A subtração' : operator === '*' ? 'A multiplicação' : 'A divisão'); if (operator === '/' && value === 0) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, 'Não é possível dividir por zero.', statement.lineNumber); context.environment[statement.name] = operator === '-' ? values[0] - values[1] : operator === '*' ? values[0] * values[1] : values[0] / values[1]; }
                }
                continue;
            }
            if (statement.type === 'expression') { await evaluate(scene, statement.expression, context, statement.lineNumber); continue; }
            if (statement.type === 'if') {
                let selected = false;
                for (const branch of statement.branches) { if (truthy(await evaluate(scene, branch.condition, context, statement.lineNumber))) { const signal = await executeBlock(scene, branch.body, context, insideLoop); if (signal) return signal; selected = true; break; } }
                if (!selected && statement.elseBody) { const signal = await executeBlock(scene, statement.elseBody, context, insideLoop); if (signal) return signal; }
                continue;
            }
            if (statement.type === 'for') {
                const iterable = await evaluate(scene, statement.iterable, context, statement.lineNumber); if (!Array.isArray(iterable)) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, 'O for desta versão deve usar range().', statement.lineNumber);
                let iterations = 0; for (const value of iterable) { if (++iterations > window.GAME_CONSTANTS.LIMITES_EXECUCAO.MAX_ITERACOES_POR_LOOP) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.LOOP_GUARD_STOP, 'A repetição ultrapassou o limite seguro.', statement.lineNumber); context.environment[statement.variable] = value; const signal = await executeBlock(scene, statement.body, context, true); if (signal === 'break') break; }
                continue;
            }
            if (statement.type === 'while') {
                let iterations = 0; while (truthy(await evaluate(scene, statement.condition, context, statement.lineNumber))) { if (++iterations > window.GAME_CONSTANTS.LIMITES_EXECUCAO.MAX_ITERACOES_POR_LOOP) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.LOOP_GUARD_STOP, 'A repetição ultrapassou o limite seguro.', statement.lineNumber); const signal = await executeBlock(scene, statement.body, context, true); if (signal === 'break') break; }
                continue;
            }
            if (statement.type === 'break') { if (!insideLoop) throw new InterpreterError(window.GAME_CONSTANTS.TERMINOS.SYNTAX_ERROR, 'break só pode ser usado dentro de um laço.', statement.lineNumber); return 'break'; }
        }
        return null;
    }
    function report (scene, result, type) { scene.lastTermination = result; if (window.GameUI) window.GameUI.definirFeedback(scene, result.message, type || 'info', result.cause); return result; }
    function finishBusy (scene) { scene.executando = false; if (window.GameUI) window.GameUI.definirExecutando(scene, false); }
    window.CommandInterpreter = {
        async executar (scene, options) {
            if (scene.executando) return { cause: 'BUSY', message: 'A execução atual ainda não terminou.' };
            const code = options && typeof options.code === 'string' ? options.code : scene.editorTexto.value;
            if (!code || !code.trim()) return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.SYNTAX_ERROR, message: 'Digite pelo menos uma instrução antes de executar.' }, 'error');
            scene.executando = true; scene.executionCount = (scene.executionCount || 0) + 1; window.DungeonSystem.resetRun(scene); if (window.GameUI) { window.GameUI.limparConsole(scene); window.GameUI.definirExecutando(scene, true); }
            let parsed;
            try { parsed = window.PythonSubsetParser.parse(code); }
            catch (error) { finishBusy(scene); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.SYNTAX_ERROR, message: `${error.lineNumber ? `Linha ${error.lineNumber}: ` : ''}${error.message}`, lineNumber: error.lineNumber || null }, 'error'); }
            const { program, analysis } = parsed; scene.runState.analysis = analysis; scene.budgetResult = window.CodeBudgetValidator.validar(scene.atividade, analysis);
            const allowedConcepts = new Set(['variables', 'strings', 'booleans', 'arithmetic', ...(scene.atividade.allowedConcepts || [])]);
            const concept = RESTRICTED.find((item) => analysis.concepts.has(item) && !allowedConcepts.has(item));
            if (concept) { finishBusy(scene); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.LOCKED_CONCEPT, message: `${concept} ainda não foi desbloqueado.` }, 'warning'); }
            const allowedCommands = new Set(scene.atividade.allowedCommands || []);
            for (const command of analysis.commands) {
                if (!window.DungeonSystem.isKnownApi(command)) { finishBusy(scene); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.UNKNOWN_COMMAND, message: `O comando ${command}() não existe na API do Pyton Knight.` }, 'warning'); }
                if (!BUILTINS.has(command) && !allowedCommands.has(command)) { finishBusy(scene); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.LOCKED_CONCEPT, message: `${command}() ainda não está disponível nesta atividade.` }, 'warning'); }
            }
            if (!scene.budgetResult.valid) { finishBusy(scene); window.MissionObjectiveSystem.avaliar(scene, analysis, {}); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.CODE_BUDGET_EXCEEDED, message: `Seu código usa ${scene.budgetResult.used} instruções e o limite é ${scene.budgetResult.limit}.` }, 'warning'); }
            const context = { environment: {}, executedInstructions: 0, analysis };
            try {
                await executeBlock(scene, program.body, context, false); scene.runState.environment = { ...context.environment };
                const tutorial = window.TutorialSystem.processarExecucao(scene, analysis); if (tutorial.handled) { finishBusy(scene); return report(scene, tutorial.result, tutorial.result.cause === window.GAME_CONSTANTS.TERMINOS.TUTORIAL_STEP_COMPLETE ? 'success' : 'info'); }
                const mission = window.MissionObjectiveSystem.avaliar(scene, analysis, context.environment);
                if (mission.allRequiredCompleted) { const reward = window.ProgressionSystem.concluirAtividade(scene); const rewardText = reward.firstCompletion ? ` +${reward.xp} XP${reward.coins ? ` e +${reward.coins} moedas` : ''}.` : ' Recompensas já consolidadas.'; finishBusy(scene); if (window.GameUI) window.GameUI.mostrarResumoConclusao(scene, reward); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.SUCCESS, message: `Atividade concluída com ${scene.livesRemaining} vida(s).${rewardText}`, reward, objectives: mission.statuses }, 'success'); }
                finishBusy(scene); return report(scene, { cause: window.GAME_CONSTANTS.TERMINOS.INCOMPLETE_EXECUTION, message: `Guto executou todo o código, mas ainda precisa cumprir: ${mission.pending.map((item) => item.label).join('; ')}.`, objectives: mission.statuses }, 'info');
            }
            catch (error) {
                const cause = error.cause || window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR; let message = `${error.lineNumber ? `Linha ${error.lineNumber}: ` : ''}${error.message}`;
                if (cause === window.GAME_CONSTANTS.TERMINOS.HAZARD_DEATH) { scene.livesRemaining--; if (scene.livesRemaining <= 0) { scene.livesRemaining = 3; message += ' As vidas acabaram; a sessão voltou a 3 vidas.'; } else message += ` Restam ${scene.livesRemaining} vida(s).`; window.DungeonSystem.resetRun(scene); }
                finishBusy(scene); if (window.GameUI) window.GameUI.atualizarVidas(scene); return report(scene, { cause, message, lineNumber: error.lineNumber || null }, cause === window.GAME_CONSTANTS.TERMINOS.HAZARD_DEATH ? 'danger' : 'error');
            }
        }
    };
})();
