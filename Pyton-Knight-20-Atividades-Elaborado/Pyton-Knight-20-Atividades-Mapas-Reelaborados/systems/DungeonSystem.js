(function () {
    'use strict';
    class PytonKnightRuntimeError extends Error { constructor (cause, message, lineNumber) { super(message); this.name = 'PytonKnightRuntimeError'; this.cause = cause; this.lineNumber = lineNumber || null; } }
    const API = new Set([
        'andar_frente', 'virar_direita', 'virar_esquerda', 'print', 'input', 'int', 'range',
        'ativar_alavanca', 'abrir_porta', 'entrar_espelho', 'entrar_portao', 'ativar_runa',
        'coletar_rubi', 'abrir_bau', 'desativar_armadilha', 'tem_chave', 'porta_aberta',
        'porta_final_bloqueada', 'armadilha_ativa', 'tem_armadilha_a_frente', 'tem_placa_a_frente',
        'placa_ativa', 'alavanca_ativa', 'alavanca_azul_ativa', 'alavanca_verde_ativa',
        'ponte_ativa', 'tem_bau_a_frente', 'encontrou_chave', 'caminho_livre',
        'moedas_coletadas', 'rubis_coletados', 'corredor_continua'
    ]);
    function clone (value) { return JSON.parse(JSON.stringify(value || [])); }
    function defaultState (type) { return ({ door: 'closed', gate: 'closed', lever: 'off', pressure_plate: 'off', toggle_plate: 'off', hazard: 'active', key: 'available', coin: 'available', output_rune: 'off', bridge: 'inactive', bridge_segment: 'inactive', mirror: 'inactive', portal: 'available', chest: 'closed', guardian: 'blocking', pedestal: 'waiting', totem: 'inactive', basilisk: 'protected' })[type] || 'idle'; }
    function matchesRequested (entity, requested) {
        if (requested === undefined || requested === null || requested === '') return true;
        return entity.id === requested || String(entity.value) === String(requested) || String(entity.label || '').toLowerCase() === String(requested).toLowerCase();
    }
    function positionKind (scene, entity) {
        const row = scene.gutoPosition.linha; const column = scene.gutoPosition.coluna;
        if (entity.row === row && entity.column === column) return 'same';
        const vector = window.GAME_CONSTANTS.VETORES_ORIENTACAO[scene.playerFacing];
        if (entity.row === row + vector.linha && entity.column === column + vector.coluna) return 'ahead';
        if (Math.abs(entity.row - row) + Math.abs(entity.column - column) === 1) return 'adjacent';
        return 'remote';
    }
    function contextualEntity (scene, types, requested, excluded, allowedPositions) {
        const list = Array.isArray(types) ? types : [types];
        const allowed = allowedPositions || ['same', 'ahead', 'adjacent'];
        const priority = { same: 0, ahead: 1, adjacent: 2, remote: 3 };
        return scene.runState.entities
            .filter((entity) => list.includes(entity.type) && !(excluded || []).includes(entity.state) && matchesRequested(entity, requested) && allowed.includes(positionKind(scene, entity)))
            .sort((a, b) => priority[positionKind(scene, a)] - priority[positionKind(scene, b)])[0] || null;
    }
    function entityAhead (scene, types, excluded) {
        return contextualEntity(scene, types, undefined, excluded, ['ahead']);
    }
    function requireEntity (scene, types, requested, excluded, allowedPositions, action, line) {
        const entity = contextualEntity(scene, types, requested, excluded, allowedPositions);
        if (entity) return entity;
        throw new PytonKnightRuntimeError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, `${action} exige que Guto esteja na posição correta da entidade.`, line);
    }
    function applyConnections (scene, entity, active) {
        (entity.connections || []).forEach((connection) => {
            const target = window.DungeonSystem.getEntity(scene, connection.targetId);
            if (target) target.state = active ? (connection.activeState || 'open') : (connection.inactiveState || defaultState(target.type));
        });
    }
    function requirementsMet (scene, entity) {
        const flags = scene.runState.flags;
        if (entity.requiresKey && !scene.runState.hasKey) return false;
        if (entity.requires && !entity.requires.every((flag) => Boolean(flags[flag]))) return false;
        if (entity.requiresAny && !entity.requiresAny.some((flag) => Boolean(flags[flag]))) return false;
        return true;
    }
    function refresh (scene) { if (window.MapRenderer) window.MapRenderer.atualizarEntidades(scene); if (window.GameUI) { window.GameUI.atualizarObjetivos(scene); window.GameUI.atualizarMoedasDaExecucao(scene); } }
    window.DungeonSystem = {
        PytonKnightRuntimeError,
        isKnownApi (name) { return API.has(name); },
        getEntity (scene, id) { return scene.runState.entities.find((entity) => entity.id === id) || null; },
        resetRun (scene) {
            const activity = scene.atividade;
            const entities = clone(activity.entities).map((entity) => ({ ...entity, state: entity.initialState || defaultState(entity.type) }));
            if (activity.chestKeyVariants) {
                const selected = activity.chestKeyVariants[(scene.sessionVariantIndex || 0) % activity.chestKeyVariants.length];
                entities.filter((entity) => entity.type === 'chest').forEach((entity) => { entity.content = entity.id === selected ? 'key' : 'empty'; });
            }
            if (activity.variantStates) {
                const variant = activity.variantStates[(scene.sessionVariantIndex || 0) % activity.variantStates.length];
                (variant || []).forEach((change) => { const entity = entities.find((item) => item.id === change.entityId); if (entity) entity.state = change.state; });
            }
            scene.runState = { entities, outputs: [], inputs: [], coinsPending: 0, flags: { ...(activity.initialFlags || {}) }, hasKey: false, reachedExit: false, environment: {}, analysis: null };
            scene.completionProcessed = false; window.PlayerController.reiniciar(scene); if (window.MapRenderer) window.MapRenderer.atualizarEntidades(scene); if (window.MissionObjectiveSystem) window.MissionObjectiveSystem.reset(scene); if (window.GameUI) window.GameUI.atualizarMoedasDaExecucao(scene);
        },
        isBlocked (scene, row, column) {
            const T = window.GAME_CONSTANTS.TERMINOS;
            if (row < 0 || row >= scene.mapa.length || column < 0 || column >= scene.mapa[0].length) return { cause: T.WALL_COLLISION, message: 'Guto tentou sair dos limites da dungeon.' };
            if (scene.mapa[row][column] === window.GAME_CONSTANTS.TILE.PAREDE) return { cause: T.WALL_COLLISION, message: 'Guto tentou atravessar uma parede.' };
            if (window.BarrierSystem && window.BarrierSystem.existe && window.BarrierSystem.existe(scene, scene.gutoPosition.linha, scene.gutoPosition.coluna, row, column)) return { cause: T.WALL_COLLISION, message: 'Uma grade bloqueia esse caminho.' };
            const blocker = scene.runState.entities.find((entity) => entity.row === row && entity.column === column && ((['door', 'gate', 'guardian'].includes(entity.type) && !['open', 'inactive', 'defeated'].includes(entity.state)) || (['bridge', 'bridge_segment'].includes(entity.type) && !['active', 'open'].includes(entity.state)) || (entity.type === 'chest' && entity.state === 'closed')));
            if (blocker) return { cause: T.CLOSED_DOOR_BLOCK, message: 'Uma porta ou passagem ainda está fechada.' };
            return null;
        },
        lethalAt (scene, row, column) {
            if (scene.mapa[row][column] === window.GAME_CONSTANTS.TILE.PERIGO) return 'Guto entrou em um perigo letal.';
            const danger = scene.runState.entities.find((entity) => entity.row === row && entity.column === column && entity.type === 'hazard' && entity.state === 'active');
            return danger ? 'Guto foi atingido por uma armadilha ativa.' : null;
        },
        onEnter (scene, row, column) {
            if (scene.mapa[row][column] === window.GAME_CONSTANTS.TILE.SAIDA) scene.runState.reachedExit = true;
            scene.runState.entities.filter((entity) => entity.row === row && entity.column === column).forEach((entity) => {
                if (entity.type === 'key' && entity.state === 'available') { entity.state = 'collected'; scene.runState.hasKey = true; scene.runState.flags.keyCollected = true; }
                if (entity.type === 'coin' && entity.state === 'available' && !entity.manualCollect) { entity.state = 'collected'; scene.runState.coinsPending++; if (entity.flag) scene.runState.flags[entity.flag] = true; }
                if (entity.type === 'pressure_plate') { entity.state = 'on'; scene.runState.flags[entity.flag || entity.id] = true; applyConnections(scene, entity, true); }
                if (entity.type === 'toggle_plate') { entity.state = entity.state === 'on' ? 'off' : 'on'; scene.runState.flags[entity.flag || entity.id] = entity.state === 'on'; applyConnections(scene, entity, entity.state === 'on'); }
            });
            refresh(scene);
        },
        async callApi (scene, name, args, metadata) {
            const line = metadata && metadata.lineNumber;
            if (name === 'andar_frente') return window.PlayerController.andarFrente(scene, args.length ? args[0] : 1, line);
            if (name === 'virar_direita') { window.PlayerController.virar(scene, 1); return true; }
            if (name === 'virar_esquerda') { window.PlayerController.virar(scene, -1); return true; }
            if (name === 'print') {
                if (scene.atividade.requirePrintContext) requireEntity(scene, ['output_rune', 'pedestal'], undefined, [], ['same', 'ahead', 'adjacent'], 'print()', line);
                const value = args.map(String).join(' '); scene.runState.outputs.push(value); if (window.GameUI) window.GameUI.adicionarConsole(scene, value);
                (scene.atividade.outputRules || []).forEach((rule) => { if (String(rule.expected) === value && (!rule.requires || rule.requires.every((flag) => Boolean(scene.runState.flags[flag])))) { (rule.flags || []).forEach((flag) => { scene.runState.flags[flag] = true; }); (rule.states || []).forEach((change) => { const entity = this.getEntity(scene, change.entityId); if (entity) entity.state = change.state; }); } }); refresh(scene); return null;
            }
            if (name === 'input') { if (scene.atividade.requireInputContext) requireEntity(scene, 'pedestal', undefined, [], ['same', 'ahead', 'adjacent'], 'input()', line); let value; if (scene.testInputQueue && scene.testInputQueue.length) value = scene.testInputQueue.shift(); else if (window.GameUI && window.GameUI.solicitarEntrada) value = await window.GameUI.solicitarEntrada(scene, args[0] || 'Entrada:'); else value = ''; scene.runState.inputs.push(String(value)); return String(value); }
            if (name === 'int') { const value = Number(args[0]); if (!Number.isInteger(value)) throw new PytonKnightRuntimeError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, `int() não conseguiu converter '${args[0]}'.`, line); return value; }
            if (name === 'range') {
                let start = 0; let stop; let step = 1;
                if (args.length === 1) stop = Number(args[0]); else { start = Number(args[0]); stop = Number(args[1]); if (args.length === 3) step = Number(args[2]); }
                if (![start, stop, step].every(Number.isInteger) || step === 0) throw new PytonKnightRuntimeError(window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR, 'range() precisa de inteiros e passo diferente de zero.', line);
                const values = []; for (let value = start; step > 0 ? value < stop : value > stop; value += step) { values.push(value); if (values.length > 100) throw new PytonKnightRuntimeError(window.GAME_CONSTANTS.TERMINOS.LOOP_GUARD_STOP, 'range() excedeu o limite seguro.', line); } return values;
            }
            if (name === 'ativar_alavanca') { const entity = requireEntity(scene, 'lever', args[0], ['on'], ['same', 'ahead', 'adjacent'], 'ativar_alavanca()', line); entity.state = 'on'; scene.runState.flags[entity.flag || entity.id] = true; applyConnections(scene, entity, true); refresh(scene); return true; }
            if (name === 'abrir_porta') { const entity = requireEntity(scene, ['door', 'gate', 'guardian'], args[0], ['open', 'defeated'], ['same', 'ahead', 'adjacent'], 'abrir_porta()', line); if (!requirementsMet(scene, entity)) return false; entity.state = entity.type === 'guardian' ? 'defeated' : 'open'; scene.runState.flags[entity.flag || `${entity.id}Open`] = true; applyConnections(scene, entity, true); refresh(scene); return true; }
            if (name === 'entrar_espelho' || name === 'entrar_portao') { const entity = requireEntity(scene, name === 'entrar_espelho' ? 'mirror' : 'portal', args[0], [], ['same'], `${name}()`, line); if (!requirementsMet(scene, entity)) return false; entity.state = 'active'; scene.runState.flags[entity.flag || `${entity.id}Used`] = true; if (entity.target) window.PlayerController.teletransportar(scene, entity.target); refresh(scene); return true; }
            if (name === 'ativar_runa') { const entity = requireEntity(scene, ['totem', 'bridge_segment', 'output_rune'], args[0], ['active', 'correct'], ['same', 'ahead'], 'ativar_runa()', line); entity.state = 'active'; scene.runState.flags[entity.flag || entity.id] = true; scene.runState.flags.runesActivated = (scene.runState.flags.runesActivated || 0) + 1; applyConnections(scene, entity, true); refresh(scene); return true; }
            if (name === 'coletar_rubi') { const entity = requireEntity(scene, 'coin', args[0], ['collected'], ['same'], 'coletar_rubi()', line); entity.state = 'collected'; scene.runState.coinsPending++; scene.runState.flags.rubiesCollected = scene.runState.coinsPending; if (entity.flag) scene.runState.flags[entity.flag] = true; refresh(scene); return true; }
            if (name === 'abrir_bau') { const entity = requireEntity(scene, 'chest', args[0], ['open'], ['same', 'ahead'], 'abrir_bau()', line); entity.state = 'open'; scene.runState.flags.lastChest = entity.id; if (entity.content === 'key') { scene.runState.hasKey = true; scene.runState.flags.keyFound = true; } refresh(scene); return entity.content || 'empty'; }
            if (name === 'desativar_armadilha') { const entity = requireEntity(scene, 'hazard', args[0], ['inactive'], ['ahead'], 'desativar_armadilha()', line); entity.state = 'inactive'; scene.runState.flags.trapsDisabled = (scene.runState.flags.trapsDisabled || 0) + 1; if (entity.flag) scene.runState.flags[entity.flag] = true; refresh(scene); return true; }
            const entities = scene.runState.entities;
            if (name === 'tem_chave' || name === 'encontrou_chave') return scene.runState.hasKey;
            if (name === 'porta_aberta') return entities.some((entity) => ['door', 'gate'].includes(entity.type) && entity.state === 'open');
            if (name === 'porta_final_bloqueada') return entities.some((entity) => ['door', 'gate', 'guardian'].includes(entity.type) && !['open', 'defeated'].includes(entity.state));
            if (name === 'armadilha_ativa') return entities.some((entity) => entity.type === 'hazard' && entity.state === 'active');
            if (name === 'tem_armadilha_a_frente' || name === 'corredor_continua') { const vector = window.GAME_CONSTANTS.VETORES_ORIENTACAO[scene.playerFacing]; const row = scene.gutoPosition.linha + vector.linha; const column = scene.gutoPosition.coluna + vector.coluna; return Boolean(entityAhead(scene, 'hazard', ['inactive']) || (scene.mapa[row] && scene.mapa[row][column] === window.GAME_CONSTANTS.TILE.PERIGO)); }
            if (name === 'tem_placa_a_frente') return Boolean(entityAhead(scene, ['pressure_plate', 'toggle_plate']));
            if (name === 'placa_ativa') return entities.some((entity) => ['pressure_plate', 'toggle_plate'].includes(entity.type) && entity.state === 'on');
            if (name === 'alavanca_ativa') return entities.some((entity) => entity.type === 'lever' && entity.state === 'on');
            if (name === 'alavanca_azul_ativa') { const entity = this.getEntity(scene, 'lever_blue'); return Boolean(entity && entity.state === 'on'); }
            if (name === 'alavanca_verde_ativa') { const entity = this.getEntity(scene, 'lever_green'); return Boolean(entity && entity.state === 'on'); }
            if (name === 'ponte_ativa') return entities.some((entity) => ['bridge', 'bridge_segment'].includes(entity.type) && ['active', 'open'].includes(entity.state));
            if (name === 'tem_bau_a_frente') return Boolean(entityAhead(scene, 'chest', ['open']));
            if (name === 'caminho_livre') { const vector = window.GAME_CONSTANTS.VETORES_ORIENTACAO[scene.playerFacing]; return !this.isBlocked(scene, scene.gutoPosition.linha + vector.linha, scene.gutoPosition.coluna + vector.coluna); }
            if (name === 'moedas_coletadas' || name === 'rubis_coletados') return scene.runState.coinsPending;
            throw new PytonKnightRuntimeError(window.GAME_CONSTANTS.TERMINOS.UNKNOWN_COMMAND, `O comando ${name}() não existe.`, line);
        }
    };
})();
