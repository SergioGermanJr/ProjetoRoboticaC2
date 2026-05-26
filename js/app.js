const MODEL_URL = './tm-my-image-model/';

const EMOJIS = {
  'Sushui':     '🍣',
  'Pizza':      '🍕',
  'Hamburguer': '🍔',
  'Sorvete':    '🍦',
};

let model       = null;
let webcam      = null;
let animFrameId = null;
let running     = false;
let predicting  = false; // prevents overlapping async predict calls
let activeTab   = 'camera';

// ── DOM refs ──
const statusDot       = document.getElementById('status-dot');
const statusText      = document.getElementById('status-text');
const btnStart        = document.getElementById('btn-start');
const btnStop         = document.getElementById('btn-stop');
const placeholderCam  = document.getElementById('placeholder-camera');
const dropZone        = document.getElementById('drop-zone');
const fileInput       = document.getElementById('file-input');
const imgPreview      = document.getElementById('img-preview');
const webcamContainer = document.getElementById('webcam-container');
const topLabel        = document.getElementById('top-label');
const topName         = document.getElementById('top-name');
const topPct          = document.getElementById('top-pct');
const topEmoji        = document.getElementById('top-emoji');
const labelConfText   = document.getElementById('label-conf-text');
const grid            = document.getElementById('classes-grid');
const controlsCamera  = document.getElementById('controls-camera');
const controlsImage   = document.getElementById('controls-image');

// ── Status ──
function setStatus(state, text) {
  statusDot.className = 'status-dot ' + state;
  statusText.textContent = text;
}

// ── Build class cards ──
function buildCards(labels) {
  grid.innerHTML = '';
  labels.forEach(label => {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.id = 'card-' + label;
    card.innerHTML = `
      <div class="class-card-top">
        <span class="class-emoji">${EMOJIS[label] || '🍽️'}</span>
        <span class="class-name">${label}</span>
        <span class="class-pct" id="pct-${label}">0%</span>
      </div>
      <div class="bar-bg">
        <div class="bar-fill" id="bar-${label}"></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function resetCards() {
  if (!model) return;
  model.getClassLabels().forEach(label => {
    document.getElementById('pct-' + label).textContent = '0%';
    document.getElementById('bar-' + label).style.width = '0%';
    document.getElementById('card-' + label).classList.remove('active');
  });
}

// ── Apply prediction results to UI ──
function applyPredictions(predictions) {
  const top = predictions.reduce((a, b) => a.probability > b.probability ? a : b);

  predictions.forEach(p => {
    const pct = Math.round(p.probability * 100);
    document.getElementById('pct-' + p.className).textContent = pct + '%';
    document.getElementById('bar-' + p.className).style.width = pct + '%';
    document.getElementById('card-' + p.className)
      .classList.toggle('active', p.className === top.className && top.probability > 0.3);
  });

  if (top.probability > 0.3) {
    topName.textContent  = top.className;
    topPct.textContent   = Math.round(top.probability * 100) + '%';
    topEmoji.textContent = EMOJIS[top.className] || '🍽️';
  } else {
    topName.textContent  = 'Aguardando...';
    topPct.textContent   = '—';
    topEmoji.textContent = '🤔';
  }
}

// ── Load model ──
async function loadModel() {
  setStatus('loading', 'Carregando modelo...');
  try {
    model = await tmImage.load(MODEL_URL + 'model.json', MODEL_URL + 'metadata.json');
    buildCards(model.getClassLabels());
    setStatus('', 'Modelo pronto.');
    btnStart.disabled = false;
  } catch (e) {
    setStatus('error', 'Erro ao carregar o modelo: ' + e.message);
    console.error(e);
  }
}

// ── Tab switching ──
function switchTab(tab) {
  if (tab === activeTab) return;
  if (activeTab === 'camera' && running) stopCamera();
  if (activeTab === 'image') clearImage();

  activeTab = tab;
  document.getElementById('tab-camera').classList.toggle('active', tab === 'camera');
  document.getElementById('tab-image').classList.toggle('active', tab === 'image');

  if (tab === 'camera') {
    placeholderCam.style.display = 'flex';
    dropZone.classList.add('hidden');
    controlsCamera.classList.remove('hidden');
    controlsImage.classList.add('hidden');
    setStatus('', 'Modelo pronto. Clique em Iniciar.');
  } else {
    placeholderCam.style.display = 'none';
    dropZone.classList.remove('hidden');
    controlsCamera.classList.add('hidden');
    controlsImage.classList.remove('hidden');
    setStatus('', 'Selecione ou arraste uma imagem.');
  }

  topLabel.classList.remove('visible');
  resetCards();
}

// ── Camera ──
async function startCamera() {
  if (!model) return;
  btnStart.disabled = true;
  btnStop.disabled = false;
  setStatus('loading', 'Ativando câmera...');
  placeholderCam.style.display = 'none';

  try {
    // flip:false so the image isn't mirrored before prediction
    webcam = new tmImage.Webcam(224, 224, false);
    await webcam.setup();
    await webcam.play();
    webcamContainer.appendChild(webcam.canvas);

    running = true;
    labelConfText.textContent = 'Classe detectada com maior probabilidade';
    setStatus('active', 'Detectando em tempo real...');
    topLabel.classList.add('visible');
    loop();
  } catch (e) {
    setStatus('error', 'Erro na câmera: ' + e.message);
    btnStart.disabled = false;
    btnStop.disabled = true;
    placeholderCam.style.display = 'flex';
  }
}

function stopCamera() {
  running = false;
  predicting = false;
  if (animFrameId) cancelAnimationFrame(animFrameId);
  if (webcam) {
    webcam.stop();
    webcamContainer.innerHTML = '';
  }
  topLabel.classList.remove('visible');
  placeholderCam.style.display = 'flex';
  btnStart.disabled = false;
  btnStop.disabled = true;
  setStatus('', 'Câmera parada. Clique em Iniciar para retomar.');
  resetCards();
}

async function loop() {
  if (!running) return;
  webcam.update();

  // Skip this frame if the previous prediction is still running
  if (!predicting) {
    predicting = true;
    try {
      const predictions = await model.predict(webcam.canvas);
      applyPredictions(predictions);
    } catch (e) {
      console.error('Predict error:', e);
    }
    predicting = false;
  }

  animFrameId = requestAnimationFrame(loop);
}

// ── Image upload ──
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  if (!model) { setStatus('error', 'Modelo ainda não carregado.'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.src = e.target.result;
    imgPreview.onload = async () => {
      dropZone.classList.add('hidden');
      imgPreview.classList.add('visible');

      setStatus('loading', 'Analisando imagem...');
      try {
        const predictions = await model.predict(imgPreview);
        applyPredictions(predictions);
        labelConfText.textContent = 'Resultado para a imagem enviada';
        topLabel.classList.add('visible');
        setStatus('active', 'Imagem analisada com sucesso.');
      } catch (err) {
        setStatus('error', 'Erro ao processar imagem: ' + err.message);
        console.error(err);
      }
    };
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  imgPreview.src = '';
  imgPreview.classList.remove('visible');
  dropZone.classList.remove('hidden');
  topLabel.classList.remove('visible');
  fileInput.value = '';
  resetCards();
  setStatus('', 'Selecione ou arraste uma imagem.');
}

// ── Events ──
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

// The file input sits on top of the drop zone (position:absolute, opacity:0)
// so drag events fire on it — attach listeners here, not on dropZone
fileInput.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

fileInput.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

fileInput.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFile(e.dataTransfer.files[0]);
});

// ── Init ──
btnStart.disabled = true;
dropZone.classList.add('hidden');
controlsImage.classList.add('hidden');
loadModel();
