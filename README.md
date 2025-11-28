# deep-questions

Aplicación web estática para rotar preguntas entre personas en orden. Permite registrar la lista de nombres, elegir el tipo de tarjeta (Conexión, Percepción, Reflexión), mostrar una pregunta aleatoria de ese tipo, marcarla como hecha y avanzar al siguiente nombre.

## Cómo usar

1. Abre `index.html` directamente en el navegador o sirve el proyecto con un servidor simple (por ejemplo, `python -m http.server 8000`).
2. Ingresa los nombres en el orden de participación (separados por coma o por líneas) y haz clic en **Guardar orden**.
3. Observa quién tiene el turno, selecciona un tipo de tarjeta y se mostrará una pregunta aleatoria de ese tipo que no se haya usado.
4. Cuando la persona responda, presiona **Marcar completada y siguiente nombre** para remover la pregunta del pool y pasar al siguiente turno.
5. Si deseas empezar de cero, usa **Reiniciar preguntas** para limpiar el progreso guardado en este navegador.

## Estructura

- `index.html`: interfaz principal.
- `styles.css`: estilos y layout.
- `app.js`: lógica de turnos, selección aleatoria y persistencia local.
