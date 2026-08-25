const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
global.window = global;
require(path.join(root, 'systems/GameConstants.js'));
require(path.join(root, 'activities.js'));
const activities = window.ACTIVITIES.slice(5);
const cellWidth = 390; const cellHeight = 250; const columns = 3; const rows = 5;
const escapeXml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' })[char]);
const colors = { 0:'#171b27', 1:'#d7c39a', 2:'#559bd6', 3:'#66c978', 4:'#d84f5e' };
const entityLabels = { door:'P', gate:'S', guardian:'G', lever:'A', pressure_plate:'◈', toggle_plate:'◇', hazard:'!', key:'K', coin:'R', pedestal:'P', output_rune:'R', bridge:'=', bridge_segment:'=', mirror:'M', portal:'O', chest:'B', totem:'T' };
const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${cellWidth * columns}" height="${cellHeight * rows}" viewBox="0 0 ${cellWidth * columns} ${cellHeight * rows}">`, '<rect width="100%" height="100%" fill="#0b0e17"/>'];
activities.forEach((activity, index) => {
    const cellX = (index % columns) * cellWidth; const cellY = Math.floor(index / columns) * cellHeight;
    const mapWidth = activity.mapa[0].length; const mapHeight = activity.mapa.length; const tile = Math.floor(Math.min(18, 340 / mapWidth, 190 / mapHeight));
    const originX = cellX + (cellWidth - mapWidth * tile) / 2; const originY = cellY + 43 + (190 - mapHeight * tile) / 2;
    parts.push(`<text x="${cellX + 14}" y="${cellY + 24}" fill="#f4f7ff" font-family="Arial" font-size="15" font-weight="700">${activity.id}. ${escapeXml(activity.nome)} — ${mapWidth}×${mapHeight}</text>`);
    for (let row = 0; row < mapHeight; row++) for (let column = 0; column < mapWidth; column++) {
        const value = activity.mapa[row][column]; parts.push(`<rect x="${originX + column * tile}" y="${originY + row * tile}" width="${tile}" height="${tile}" fill="${colors[value]}" stroke="#31394a" stroke-width="0.6"/>`);
    }
    for (const entity of activity.entities || []) {
        const x = originX + entity.column * tile + tile / 2; const y = originY + entity.row * tile + tile * 0.72; const label = entity.symbol || (entity.value !== undefined ? entity.value : entityLabels[entity.type] || '?');
        parts.push(`<circle cx="${x}" cy="${originY + entity.row * tile + tile / 2}" r="${tile * 0.38}" fill="#29213e" stroke="#f7e37b" stroke-width="1"/><text x="${x}" y="${y}" text-anchor="middle" fill="#fff" font-family="Arial" font-size="${Math.max(8, tile * 0.62)}" font-weight="700">${escapeXml(label)}</text>`);
    }
    parts.push(`<rect x="${cellX + 3}" y="${cellY + 3}" width="${cellWidth - 6}" height="${cellHeight - 6}" fill="none" stroke="#364155" stroke-width="1"/>`);
});
parts.push('</svg>');
fs.mkdirSync(path.join(root, 'build'), { recursive:true });
fs.writeFileSync(path.join(root, 'build/map_contact_sheet.svg'), parts.join(''));
