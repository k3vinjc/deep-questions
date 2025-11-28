const TYPES = {
  conexion: 'Conexión',
  percepcion: 'Percepción',
  reflexion: 'Reflexión',
};

const BASE_QUESTIONS = [
  { text: '¿Qué fue lo primero que pensaste de mí cuando me conociste?', type: 'percepcion' },
  { text: 'Si tuvieras que describir a la persona de tu derecha con una sola palabra, ¿cuál sería?', type: 'percepcion' },
  { text: '¿Qué detalle pequeño de tu personalidad crees que casi nadie nota?', type: 'percepcion' },
  { text: '¿Qué crees que la gente asume de ti, pero no es cierto?', type: 'percepcion' },
  { text: '¿Qué tipo de amigo dirías que eres en el grupo: el que escucha, el que hace reír, el que organiza, etc.?', type: 'percepcion' },
  { text: '¿Qué canción sientes que pega con la vibra de este grupo?', type: 'percepcion' },
  { text: '¿Qué actividad te gustaría que hiciéramos todos juntos algún día (aunque suene loca)?', type: 'percepcion' },
  { text: '¿Qué es algo que te emociona últimamente, aunque sea algo sencillo?', type: 'percepcion' },
  { text: '¿Qué tanto muestras tus emociones del 1 al 10? ¿Por qué?', type: 'percepcion' },
  { text: 'Si alguien viera solo tu Instagram, ¿qué idea se haría de ti que no es del todo cierta?', type: 'percepcion' },
  { text: '¿Qué ha sido lo más retador de tu vida en estos últimos 12 meses?', type: 'conexion' },
  { text: '¿Cuándo fue la última vez que te sentiste realmente escuchado/a por alguien de este grupo? ¿Qué pasó?', type: 'conexion' },
  { text: '¿Qué parte de tu historia casi nunca cuentas, pero te marcó mucho?', type: 'conexion' },
  { text: '¿Qué área de tu carácter sientes que Dios está trabajando en esta temporada?', type: 'conexion' },
  { text: '¿Qué miedo tienes que casi nadie conoce?', type: 'conexion' },
  { text: 'Menciona un momento específico en el que alguien de este grupo te hizo sentir acompañado/a.', type: 'conexion' },
  { text: '¿Qué hábito te gustaría desarrollar para parecerte más a Jesús en lo práctico?', type: 'conexion' },
  { text: '¿Qué mentira sobre ti mismo/a has tenido que pelear (por ejemplo: "no soy suficiente", "siempre fallo", etc.)?', type: 'conexion' },
  { text: '¿En qué momento de tu vida sentiste más claramente que Dios te estaba guiando?', type: 'conexion' },
  { text: 'Si pudieras pedir oración por una sola cosa hoy, ¿por qué sería?', type: 'conexion' },
  { text: '¿Qué has aprendido de Dios a través de la amistad con este grupo?', type: 'reflexion' },
  { text: '¿Qué regalo no material crees que le has dado al grupo (tu forma de ser, algo que aportas)?', type: 'reflexion' },
  { text: '¿Qué ves en la persona de tu izquierda que te inspira a ser mejor?', type: 'reflexion' },
  { text: "Termina la frase sobre el grupo: 'Me alegra pertenecer aquí porque…'", type: 'reflexion' },
  { text: '¿Qué conversación pendiente sientes que tienes con alguien del grupo (sin decir nombres si no quieres)?', type: 'reflexion' },
  { text: '¿Qué te gustaría que nunca falte en nuestra amistad: honestidad, diversión, oración, etc.? ¿Por qué?', type: 'reflexion' },
  { text: 'Si no volviéramos a vernos en un año, ¿qué te gustaría que cada uno de nosotros recordara de ti?', type: 'reflexion' },
  { text: '¿De qué te sientes agradecido hoy respecto a este grupo? Sé específico.', type: 'reflexion' },
  { text: '¿Qué cambio positivo has notado en ti desde que formas parte de este grupo?', type: 'reflexion' },
  { text: 'Di algo en voz alta que normalmente solo pensarías, pero no dirías, sobre este grupo (algo bueno, de ánimo).', type: 'reflexion' },
];

const STORAGE_KEY = 'dq-rotacion-v1';

const namesInput = document.getElementById('namesInput');
const saveNamesButton = document.getElementById('saveNamesButton');
const namesList = document.getElementById('namesList');
const statusText = document.getElementById('statusText');
const turnBadge = document.getElementById('turnBadge');
const remainingText = document.getElementById('remainingText');
const turnText = document.getElementById('turnText');
const questionText = document.getElementById('questionText');
const hintText = document.getElementById('hintText');
const completeButton = document.getElementById('completeButton');
const resetButton = document.getElementById('resetButton');
const chips = Array.from(document.querySelectorAll('.chip'));

function buildInitialQuestions() {
  return BASE_QUESTIONS.map((q) => ({ ...q, done: false }));
}

function defaultSession() {
  return {
    names: [],
    currentIndex: 0,
    activeQuestion: null,
    activeType: null,
    questions: buildInitialQuestions(),
  };
}

function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultSession();
  try {
    const parsed = JSON.parse(raw);
    const questions = buildInitialQuestions().map((base) => {
      const found = parsed.questions?.find((q) => q.text === base.text);
      return found ? { ...base, done: Boolean(found.done) } : base;
    });
    return {
      ...defaultSession(),
      ...parsed,
      questions,
    };
  } catch (err) {
    console.error('No se pudo leer la sesión, reiniciando', err);
    return defaultSession();
  }
}

function persistSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function getCurrentName(session) {
  if (!session.names.length) return null;
  return session.names[session.currentIndex % session.names.length];
}

function getRemainingByType(session, type) {
  return session.questions.filter((q) => q.type === type && !q.done).length;
}

function renderNames(session) {
  namesList.innerHTML = '';
  if (!session.names.length) return;

  const fragment = document.createDocumentFragment();
  session.names.forEach((name, idx) => {
    const pill = document.createElement('div');
    pill.className = 'name-pill';
    if (idx === session.currentIndex) {
      pill.classList.add('active');
    }
    pill.textContent = `${idx + 1}. ${name}`;
    fragment.appendChild(pill);
  });
  namesList.appendChild(fragment);
}

function updateChips(session, activeType) {
  chips.forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.type === activeType);
    const remaining = getRemainingByType(session, chip.dataset.type);
    chip.dataset.remaining = remaining;
  });
}

function updateBadge(session) {
  const name = getCurrentName(session);
  if (!name) {
    turnBadge.textContent = 'Turno';
    turnBadge.classList.remove('ready');
    turnText.textContent = 'Agrega nombres para comenzar.';
    return;
  }
  turnBadge.textContent = `Turno de ${name}`;
  turnBadge.classList.add('ready');
  turnText.textContent = `${name}, elige un tipo de tarjeta.`;
}

function updateRemainingText(session) {
  const totals = Object.keys(TYPES)
    .map((key) => `${TYPES[key]}: ${getRemainingByType(session, key)}`)
    .join(' · ');
  remainingText.textContent = totals;
}

function renderQuestion(session) {
  if (session.activeQuestion) {
    questionText.textContent = session.activeQuestion;
    hintText.textContent = `Tipo: ${TYPES[session.activeType]}`;
  } else {
    const totalLeft = session.questions.filter((q) => !q.done).length;
    questionText.textContent = totalLeft
      ? 'Selecciona un tipo para obtener una pregunta aleatoria.'
      : 'No quedan preguntas disponibles. Reinicia para comenzar de nuevo.';
    hintText.textContent = '';
  }
}

function renderStatus(session, message) {
  if (message) {
    statusText.textContent = message;
    return;
  }

  if (!session.questions.some((q) => !q.done)) {
    statusText.textContent = 'No quedan preguntas disponibles. Usa Reiniciar para comenzar de nuevo.';
    return;
  }

  statusText.textContent = session.names.length
    ? 'Selecciona un tipo y marca la pregunta para pasar al siguiente nombre.'
    : 'Agrega nombres y guarda para iniciar.';
}

function render(session, message) {
  if (document.activeElement !== namesInput) {
    namesInput.value = session.names.join(', ');
  }
  renderNames(session);
  updateBadge(session);
  updateRemainingText(session);
  updateChips(session, session.activeType);
  renderQuestion(session);
  renderStatus(session, message);
}

function saveNames(session) {
  const names = namesInput.value
    .split(/,|\n/)
    .map((n) => n.trim())
    .filter(Boolean);

  if (!names.length) {
    render(session, 'Necesitas al menos un nombre.');
    return session;
  }

  const updated = {
    ...session,
    names,
    currentIndex: 0,
    activeQuestion: null,
    activeType: null,
  };
  persistSession(updated);
  render(updated, 'Orden guardado. Empieza el primer nombre.');
  return updated;
}

function pickQuestion(session, type) {
  if (!session.names.length) {
    render(session, 'Agrega y guarda nombres antes de elegir un tipo.');
    return session;
  }

  const available = session.questions.filter((q) => q.type === type && !q.done);
  if (!available.length) {
    const updated = { ...session, activeQuestion: null, activeType: null };
    persistSession(updated);
    render(updated, `No quedan preguntas de ${TYPES[type]}.`);
    return updated;
  }

  const random = available[Math.floor(Math.random() * available.length)];
  const updated = { ...session, activeQuestion: random.text, activeType: type };
  persistSession(updated);
  render(updated, `Pregunta de ${TYPES[type]} lista.`);
  return updated;
}

function markCompleted(session) {
  if (!session.activeQuestion) {
    render(session, 'Primero elige un tipo para obtener una pregunta.');
    return session;
  }

  const updatedQuestions = session.questions.map((q) =>
    q.text === session.activeQuestion ? { ...q, done: true } : q
  );

  const updatedIndex = session.names.length
    ? (session.currentIndex + 1) % session.names.length
    : 0;

  const updated = {
    ...session,
    questions: updatedQuestions,
    currentIndex: updatedIndex,
    activeQuestion: null,
    activeType: null,
  };

  persistSession(updated);
  render(updated, 'Pregunta marcada como hecha. Turno para la siguiente persona.');
  return updated;
}

function resetSession() {
  const fresh = defaultSession();
  persistSession(fresh);
  render(fresh, 'Preguntas reiniciadas. Ingresa los nombres nuevamente.');
  return fresh;
}

let session = loadSession();
render(session);

saveNamesButton.addEventListener('click', () => {
  session = saveNames(session);
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    session = pickQuestion(session, chip.dataset.type);
  });
});

completeButton.addEventListener('click', () => {
  session = markCompleted(session);
});

resetButton.addEventListener('click', () => {
  session = resetSession();
});
