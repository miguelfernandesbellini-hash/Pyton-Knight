(function () {
    'use strict';
    const COLORS = { door: 0x8b5e3c, gate: 0x8b5e3c, guardian: 0xc43d5a, lever: 0xf2c14e, pressure_plate: 0x5fd08a, toggle_plate: 0x5fd08a, hazard: 0xe03e52, key: 0xffdf55, coin: 0xf6c945, pedestal: 0x547aa5, output_rune: 0x62c8ff, bridge: 0x9c7a54, bridge_segment: 0x9c7a54, mirror: 0xb984e8, portal: 0x9f8cff, chest: 0x8e623c, totem: 0x65d6c5, basilisk: 0x65b25d };
    const LABELS = { door: 'P', gate: 'S', guardian: 'G', lever: 'A', pressure_plate: '◈', toggle_plate: '◇', hazard: '!', key: '⌘', coin: '◆', pedestal: 'P', output_rune: 'R', bridge: '═', bridge_segment: '═', mirror: '◉', portal: '◎', chest: 'B', totem: 'T', basilisk: 'B' };
    function xy (scene, row, column) { return { x: scene.startX + column * scene.tileSize, y: scene.startY + row * scene.tileSize }; }
    window.MapRenderer = {
        desenhar (scene) {
            const T = window.GAME_CONSTANTS.TILE;
            for (let row = 0; row < scene.mapa.length; row++) for (let column = 0; column < scene.mapa[row].length; column++) {
                const tile = scene.mapa[row][column]; const point = xy(scene, row, column);
                if (tile === T.PAREDE) scene.add.image(point.x, point.y, 'parede').setDisplaySize(scene.tileSize, scene.tileSize).setDepth(1);
                else { scene.add.image(point.x, point.y, 'caminho').setDisplaySize(scene.tileSize, scene.tileSize).setDepth(1); if (tile === T.SAIDA) scene.add.image(point.x, point.y, 'saida').setDisplaySize(scene.tileSize * 0.78, scene.tileSize * 0.82).setDepth(4); if (tile === T.PERIGO) scene.add.rectangle(point.x, point.y, scene.tileSize * 0.72, scene.tileSize * 0.72, 0xdf334d, 0.85).setDepth(3); if (tile === T.INICIO) { scene.guto = scene.add.image(point.x, point.y, 'guto').setDisplaySize(scene.tileSize * 0.78, scene.tileSize * 0.95).setDepth(10); scene.gutoFacingIndicator = scene.add.text(point.x, point.y - scene.tileSize * 0.55, '→', { font: `bold ${Math.max(18, scene.tileSize * 0.35)}px Arial`, color: '#ffe66b', stroke: '#111111', strokeThickness: 4 }).setOrigin(0.5).setDepth(12); } }
            }
            (scene.atividade.regions || []).forEach((region) => {
                const center = xy(scene, region.row + (region.height - 1) / 2, region.column + (region.width - 1) / 2);
                scene.add.rectangle(center.x, center.y, region.width * scene.tileSize - 4, region.height * scene.tileSize - 4, region.color || 0x46607a, 0.11).setStrokeStyle(2, region.color || 0x7fa7c8, 0.65).setDepth(2);
                if (scene.tileSize >= 34 && region.width >= 2) {
                    const labelPoint = xy(scene, region.row, region.column);
                    scene.add.text(labelPoint.x - scene.tileSize * 0.42, labelPoint.y - scene.tileSize * 0.42, region.label, { font: `bold ${Math.max(9, scene.tileSize * 0.18)}px Arial`, color: '#d8edff', backgroundColor: '#111827aa', padding: { x: 3, y: 2 } }).setDepth(5);
                }
            });
            scene.entityVisuals = []; this.atualizarEntidades(scene);
        },
        atualizarEntidades (scene) {
            (scene.entityVisuals || []).forEach((item) => item.destroy && item.destroy()); scene.entityVisuals = [];
            if (!scene.runState) return;
            scene.runState.entities.forEach((entity) => {
                if (!Number.isFinite(entity.row) || !Number.isFinite(entity.column)) return;
                if (['key', 'coin'].includes(entity.type) && entity.state === 'collected') return;
                const point = xy(scene, entity.row, entity.column); const active = ['open','active','on','correct','collected','defeated','inactive'].includes(entity.state); const alpha = active ? 0.48 : 0.92;
                const shape = scene.add.rectangle(point.x, point.y, scene.tileSize * 0.52, scene.tileSize * 0.52, COLORS[entity.type] || 0x7a80a0, alpha).setStrokeStyle(2, active ? 0xbbe8ff : 0xffffff, 0.9).setDepth(6);
                const entityLabel = entity.symbol || (entity.value !== undefined ? String(entity.value) : LABELS[entity.type]) || '?';
                const text = scene.add.text(point.x, point.y, entityLabel, { font: `bold ${Math.max(13, scene.tileSize * 0.26)}px Arial`, color: '#ffffff' }).setOrigin(0.5).setDepth(7);
                scene.entityVisuals.push(shape, text);
            });
        }
    };
})();
