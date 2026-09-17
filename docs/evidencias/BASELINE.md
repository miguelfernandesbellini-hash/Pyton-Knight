# Estado inicial — 14/09/2026

Backup byte a byte dos anexos concluído antes de alterações. Inventário SHA-256 em arquivos_originais_sha256.json. Planilha consultada apenas por extração XML, nunca salva.

Suíte original: PASS; 27 cenários oficiais e 27 replays; 20 atividades × 15 verificações funcionais; 15 mapas × 14 verificações; 23 regressões; 14 etapas tutoriais. A contagem de verificações é a declarada pela suíte (alguns cenários usam fixtures).

Sondagens adicionais: indentação regular de 4 espaços passa; 2 espaços válidos e comentários com indentação arbitrária são rejeitados. AURORA/CORAGEM exatas passam; espaços externos bloqueiam. int("") e int("3.0") aceitos incorretamente; int(3.8) rejeitado incorretamente; range("2") e comparação de texto com número aceitos incorretamente.

Auditoria estática: Livro sem altura máxima; feedback expansível; editor sem Tab/autoindentação/números; inputs só usam placeholder; dados CORAGEM, 2/3, A/B/C, energia e faixas de poder incompletos na interface; câmera inexistente; entidades e grades geométricas; indicador de orientação não acompanha a posição; tutorialStepIndex pode persistir no reinício da mesma Scene; objetivos só recalculados no fim; pressão sem onExit; falha de localStorage perde estado em memória entre load/save.

Fontes lidas: quatro DOCX oficiais, histórico DOCX, relatórios existentes, catálogo/mapeamento e seleção final de assets. A seleção final Castle prevalece sobre a recomendação preliminar SBS. O gabarito alinhado à esquerda é histórico e incompatível com blocos Python; não será utilizado para eliminar a indentação. As officialSolution da versão principal serão preservadas.
