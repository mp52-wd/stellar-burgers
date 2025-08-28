// Импортируем commands.js используя ES2015 синтаксис:
import './commands'

// Альтернативно можно использовать CommonJS синтаксис:
// require('./commands')

// Скрываем fetch/XHR запросы из лога команд
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name { display: none; }';
    app.document.head.appendChild(style);
  });
}
