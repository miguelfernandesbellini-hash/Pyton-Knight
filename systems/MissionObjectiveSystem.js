(function () {
    'use strict';
    function done (scene, objective, analysis, environment) {
        const state = scene.runState;
        switch (objective.type) {
        case 'reach_exit': return Boolean(state.reachedExit);
        case 'used_concept': return Boolean(analysis && analysis.concepts.has(objective.concept));
        case 'used_command': return Boolean(analysis && analysis.commands.has(objective.command));
        case 'output_equals': return state.outputs.some((value) => String(value) === String(objective.value));
        case 'entity_state': { const entity = window.DungeonSystem.getEntity(scene, objective.entityId); return Boolean(entity && entity.state === objective.state); }
        case 'flag': return Boolean(state.flags[objective.flag]);
        case 'has_key': return Boolean(state.hasKey);
        case 'coins': return state.coinsPending >= objective.count;
        case 'variable_equals': return environment && environment[objective.name] === objective.value;
        case 'budget': return Boolean(scene.budgetResult && scene.budgetResult.valid);
        default: return false;
        }
    }
    window.MissionObjectiveSystem = {
        reset (scene) { scene.objectiveStatuses = (scene.atividade.objectives || []).map((objective) => ({ ...objective, completed: false })); if (window.GameUI) window.GameUI.atualizarObjetivos(scene); },
        avaliar (scene, analysis, environment) { const statuses = (scene.atividade.objectives || []).map((objective) => ({ ...objective, completed: done(scene, objective, analysis, environment) })); scene.objectiveStatuses = statuses; if (window.GameUI) window.GameUI.atualizarObjetivos(scene); const pending = statuses.filter((item) => !item.completed); return { statuses, pending, allRequiredCompleted: statuses.length > 0 && pending.length === 0 }; }
    };
})();
