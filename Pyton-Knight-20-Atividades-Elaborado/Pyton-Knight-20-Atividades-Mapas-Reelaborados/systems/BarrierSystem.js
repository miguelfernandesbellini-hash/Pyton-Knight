window.BarrierSystem = {

    // =========================================
    // DESENHAR TODAS AS BARREIRAS DA ATIVIDADE
    // =========================================

    desenhar(scene)
    {
        const barreiras = scene.barreiras || [];

        for (const barreira of barreiras)
        {
            const de = barreira.de;
            const para = barreira.para;

            const x1 =
                scene.startX +
                de.coluna * scene.tileSize;

            const y1 =
                scene.startY +
                de.linha * scene.tileSize;

            const x2 =
                scene.startX +
                para.coluna * scene.tileSize;

            const y2 =
                scene.startY +
                para.linha * scene.tileSize;

            const meioX =
                (x1 + x2) / 2;

            const meioY =
                (y1 + y2) / 2;


            // =====================================
            // CASAS UMA EM CIMA DA OUTRA
            // =====================================

            if (de.coluna === para.coluna)
            {
                scene.add.rectangle(
                    meioX,
                    meioY,
                    62,
                    7,
                    0xff0000
                )
                .setDepth(8);
            }


            // =====================================
            // CASAS LADO A LADO
            // =====================================

            else if (de.linha === para.linha)
            {
                scene.add.rectangle(
                    meioX,
                    meioY,
                    7,
                    62,
                    0xff0000
                )
                .setDepth(8);
            }
        }
    },


    // =========================================
    // VERIFICAR SE EXISTE BARREIRA
    // ENTRE DUAS CASAS
    // =========================================

    existe(
        scene,
        linhaAtual,
        colunaAtual,
        novaLinha,
        novaColuna
    )
    {
        const barreiras =
            scene.barreiras || [];


        return barreiras.some(
            barreira =>
            {
                const ida =
                    barreira.de.linha === linhaAtual &&
                    barreira.de.coluna === colunaAtual &&
                    barreira.para.linha === novaLinha &&
                    barreira.para.coluna === novaColuna;


                const volta =
                    barreira.para.linha === linhaAtual &&
                    barreira.para.coluna === colunaAtual &&
                    barreira.de.linha === novaLinha &&
                    barreira.de.coluna === novaColuna;


                return ida || volta;
            }
        );
    }

};