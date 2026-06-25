const text = document.getElementById('text');
const count = document.getElementById('count');
const player = document.getElementById('player');
const historyDiv = document.getElementById('history');

let currentAudio = null;
let generatedChunks = [];

text.value = localStorage.getItem('savedText') || '';
count.textContent = text.value.length + ' characters';

function saveHistory(item) {
    const h = JSON.parse(
        localStorage.getItem('ttsHistory') || '[]'
    );

    h.unshift(item);

    localStorage.setItem(
        'ttsHistory',
        JSON.stringify(h.slice(0, 20))
    );

    renderHistory();
}

function renderHistory() {
    const h = JSON.parse(
        localStorage.getItem('ttsHistory') || '[]'
    );

    historyDiv.innerHTML = '';

    h.forEach(x => {

        const d =
            document.createElement('div');

        d.className = 'history-item';

        d.textContent =
            x.time +
            ' - ' +
            x.text.slice(0, 40);

        historyDiv.appendChild(d);
    });
}

renderHistory();

text.addEventListener('input', () => {

    count.textContent =
        text.value.length +
        ' characters';

    localStorage.setItem(
        'savedText',
        text.value
    );
});

async function generateSpeech(content) {

    return await puter.ai.txt2speech(
        content,
        {
            provider: "elevenlabs",

            voice:
                document
                .getElementById('voice')
                .value,

            model:
                document
                .getElementById('model')
                .value,

            output_format:
                document
                .getElementById('format')
                .value
        }
    );
}

function splitTextSmart(
    text,
    maxChars = 3000
) {

    const chunks = [];

    let remaining =
        text.trim();

    while (
        remaining.length >
        maxChars
    ) {

        let split =
            remaining.lastIndexOf(
                "\n\n",
                maxChars
            );

        if (split < 0) {

            const sentenceEnds =
                [
                    ". ",
                    "! ",
                    "? "
                ];

            for (
                const ending
                of sentenceEnds
            ) {

                const idx =
                    remaining.lastIndexOf(
                        ending,
                        maxChars
                    );

                if (idx > split) {

                    split =
                        idx + 1;
                }
            }
        }

        if (split < 0) {

            split =
                remaining.lastIndexOf(
                    "\n",
                    maxChars
                );
        }

        if (split < 0) {

            split =
                remaining.lastIndexOf(
                    " ",
                    maxChars
                );
        }

        if (split < 0) {

            split = maxChars;
        }

        chunks.push(
            remaining
            .slice(
                0,
                split
            )
            .trim()
        );

        remaining =
            remaining
            .slice(split)
            .trim();
    }

    if (
        remaining.length
    ) {

        chunks.push(
            remaining
        );
    }

    return chunks;
}

document
.getElementById('generate')
.onclick = async () => {

    try {

        const progress =
            document.getElementById(
                'progress'
            );

        generatedChunks = [];

        const chunks =
            splitTextSmart(
                text.value
            );

        if (
            chunks.length === 0
        ) {

            alert(
                'Enter text first'
            );

            return;
        }

        progress.textContent =
            `Preparing ${chunks.length} chunks`;

        for (
            let i = 0;
            i < chunks.length;
            i++
        ) {

            progress.textContent =
                `Generating ${i + 1}/${chunks.length}`;

            try {

                const audio =
                    await generateSpeech(
                        chunks[i]
                    );

                generatedChunks.push(
                    audio
                );

            }
            catch (err) {

                console.error(
                    err
                );

                progress.textContent =
                    `Failed on chunk ${i + 1}`;

                alert(
                    `Chunk ${i + 1} failed`
                );

                return;
            }
        }

        currentAudio =
            generatedChunks[
                generatedChunks.length - 1
            ];

        player.src =
            currentAudio.toString();

        player.play();

        progress.textContent =
            `Finished (${chunks.length} chunks)`;

        saveHistory(
            {
                time:
                    new Date()
                    .toLocaleString(),

                text:
                    text.value
            }
        );

        alert(
            `Generated ${chunks.length} chunks successfully.\n\nNext step: WAV merge.`
        );

    }
    catch (e) {

        console.error(e);

        alert(
            e.message
        );
    }
};

document
.getElementById('download')
.onclick = () => {

    if (
        !currentAudio
    ) {

        alert(
            'Generate audio first'
        );

        return;
    }

    const a =
        document.createElement(
            'a'
        );

    a.href =
        currentAudio.toString();

    a.download =
        'speech_' +
        Date.now() +
        '.mp3';

    a.click();
};

document
.getElementById('batchGenerate')
.onclick = async () => {

    const scripts =
        document
        .getElementById(
            'batchText'
        )
        .value
        .split('---')
        .map(
            x =>
            x.trim()
        )
        .filter(Boolean);

    const progress =
        document.getElementById(
            'progress'
        );

    for (
        let i = 0;
        i < scripts.length;
        i++
    ) {

        progress.textContent =
            `${i + 1} / ${scripts.length} completed`;

        try {

            await generateSpeech(
                scripts[i]
            );

        }
        catch (e) {

            console.error(
                e
            );
        }
    }

    progress.textContent =
        'Finished';
};
