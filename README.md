# ARG-сайт (червоточина + автообновление)

- Вход: чёрный экран → нажмите любую кнопку → анимация червоточины → фиолетовый текст.
- Текст берётся из `content.json`.
- Автообновление: полная перезагрузка страницы каждые 5 минут с кэш‑бастингом.

## Редактирование текста
Правьте `content.json` (поле `title` и массив `lines`). Обновление подтянется автоматически при очередной перезагрузке.

## Локальная проверка
Нужен простой HTTP‑сервер (чтобы fetch к `content.json` работал):

- Python: `py -3 -m http.server 5173` → http://localhost:5173/
- Node: `npx http-server -p 5173` или `npx serve -l 5173 .`
- VS Code: «Open with Live Server» на `index.html`.

## Хостинг
Любой статический (GitHub Pages, Netlify, Vercel, Nginx/Apache). Бэкенд не нужен.

## Git
Рабочая ветка: `feat/arg-wormhole-site`.

```
git checkout -b feat/arg-wormhole-site
git add .
git commit -m "feat(arg): wormhole intro, auto-reload, editable purple text"
git push -u origin feat/arg-wormhole-site
```

PR: https://github.com/Suosaari/site/compare/main...feat/arg-wormhole-site?expand=1
