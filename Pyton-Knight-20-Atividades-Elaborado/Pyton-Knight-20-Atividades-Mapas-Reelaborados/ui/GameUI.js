(function () {
    'use strict';
    function q (scene, selector) { return scene.bookNode ? scene.bookNode.querySelector(selector) : null; }
    function setText (scene, selector, value) { const node = q(scene, selector); if (node) node.textContent = value; }
    window.GameUI = {
        criar (scene) {
            const html = `<section class="magic-book" aria-label="Livro Mágico">
                <header><div><small>UNIDADE ${scene.atividade.unidade} · ATIVIDADE ${scene.atividade.id}/20</small><h1></h1><p class="description"></p></div><div class="hud"><span class="lives"></span><span class="facing"></span><span class="progress"></span></div></header>
                <div class="book-grid"><aside><h2>Objetivos da Missão</h2><ul class="objectives"></ul><div class="tutor"><h2>Tutor</h2><strong class="tutor-title"></strong><p class="tutor-message"></p></div><h2>Console</h2><pre class="console"></pre></aside>
                <main><label for="pk-code">Código Python</label><textarea id="pk-code" spellcheck="false"></textarea><div class="input-row"><input class="runtime-input" placeholder="input() aparecerá aqui" disabled><button class="input-send" disabled>ENVIAR</button></div><div class="feedback" data-type="info">Escreva seu programa e pressione EXECUTAR.</div><div class="actions"><button class="run">▶ EXECUTAR</button><button class="restore">RESTAURAR</button><button class="previous">← ANTERIOR</button><button class="next">PRÓXIMA →</button></div></main></div>
            </section>`;
            scene.bookDOM = scene.add.dom(1042, 414).createFromHTML(html); scene.bookNode = scene.bookDOM.node; scene.editorTexto = q(scene, '#pk-code'); scene.editorTexto.value = scene.atividade.codigoInicial || '';
            setText(scene, 'h1', scene.atividade.nome); setText(scene, '.description', scene.atividade.descricao);
            q(scene, '.run').addEventListener('click', () => window.CommandInterpreter.executar(scene));
            q(scene, '.restore').addEventListener('click', () => { if (scene.executando) return; const steps = scene.atividade.tutorialSteps; scene.editorTexto.value = steps ? steps[scene.tutorialStepIndex || 0].code : scene.atividade.codigoInicial || ''; window.DungeonSystem.resetRun(scene); this.definirFeedback(scene, 'Código inicial restaurado; as vidas foram preservadas.', 'info'); });
            q(scene, '.previous').addEventListener('click', () => { if (!scene.executando && scene.atividadeIndex > 0) scene.scene.start('Game', { atividadeIndex: scene.atividadeIndex - 1 }); });
            q(scene, '.next').addEventListener('click', () => { if (scene.executando || scene.atividadeIndex >= 19) return; const id = scene.atividadeIndex + 2; if (window.ProgressionSystem.atividadeDesbloqueada(scene, id)) scene.scene.start('Game', { atividadeIndex: scene.atividadeIndex + 1 }); else this.definirFeedback(scene, 'Conclua a atividade atual para liberar a próxima.', 'warning'); });
            this.atualizarObjetivos(scene); this.atualizarTutor(scene);
        },
        atualizarObjetivos (scene) { const list = q(scene, '.objectives'); if (!list) return; list.textContent = ''; (scene.objectiveStatuses || scene.atividade.objectives || []).forEach((item) => { const li = document.createElement('li'); li.className = item.completed ? 'done' : ''; li.textContent = `${item.completed ? '✓' : '○'} ${item.label}`; list.appendChild(li); }); },
        atualizarTutor (scene) { const box = q(scene, '.tutor'); if (!box) return; const steps = scene.atividade.tutorialSteps; box.hidden = !steps; if (!steps) return; const step = steps[scene.tutorialStepIndex || 0]; setText(scene, '.tutor-title', step.title); setText(scene, '.tutor-message', step.message || 'Execute o trecho e observe o resultado.'); },
        atualizarVidas (scene) { setText(scene, '.lives', `VIDAS ${'♥'.repeat(scene.livesRemaining)}${'♡'.repeat(3 - scene.livesRemaining)}`); },
        atualizarOrientacao (scene) { const vector = window.GAME_CONSTANTS.VETORES_ORIENTACAO[scene.playerFacing]; setText(scene, '.facing', `${vector.simbolo} ${scene.playerFacing}`); },
        atualizarProgresso (scene) { const progress = scene.playerProgress || window.PersistenceService.load(); setText(scene, '.progress', `XP ${progress.totalXp} · MOEDAS ${progress.walletCoins}`); const next = q(scene, '.next'); if (next) next.disabled = scene.atividadeIndex >= 19 || !window.ProgressionSystem.atividadeDesbloqueada(scene, scene.atividadeIndex + 2); },
        atualizarMoedasDaExecucao (scene) { const progress = scene.playerProgress || window.PersistenceService.load(); const pending = scene.runState ? scene.runState.coinsPending : 0; setText(scene, '.progress', `XP ${progress.totalXp} · MOEDAS ${progress.walletCoins}${pending ? ` (+${pending})` : ''}`); },
        definirFeedback (scene, message, type, cause) { const node = q(scene, '.feedback'); if (!node) return; node.dataset.type = type || 'info'; node.textContent = cause ? `[${cause}] ${message}` : message; },
        definirExecutando (scene, value) { const run = q(scene, '.run'); if (run) { run.disabled = value; run.textContent = value ? 'EXECUTANDO…' : '▶ EXECUTAR'; } },
        adicionarConsole (scene, value) { const node = q(scene, '.console'); if (node) node.textContent += `${value}\n`; },
        limparConsole (scene) { const node = q(scene, '.console'); if (node) node.textContent = ''; },
        mostrarResumoConclusao (scene, reward) { this.atualizarProgresso(scene); this.definirFeedback(scene, `Vitória! ${reward.xp ? `+${reward.xp} XP` : 'recompensa já consolidada'}${reward.coins ? ` · +${reward.coins} moedas` : ''}.`, 'success'); },
        solicitarEntrada (scene, prompt) {
            const input = q(scene, '.runtime-input'); const send = q(scene, '.input-send'); if (!input || !send) return Promise.resolve('');
            input.disabled = false; send.disabled = false; input.placeholder = String(prompt || 'Entrada:'); input.value = ''; input.focus();
            return new Promise((resolve) => { const finish = () => { const value = input.value; input.disabled = true; send.disabled = true; send.removeEventListener('click', finish); input.removeEventListener('keydown', key); resolve(value); }; const key = (event) => { if (event.key === 'Enter') finish(); }; send.addEventListener('click', finish); input.addEventListener('keydown', key); });
        }
    };
})();
