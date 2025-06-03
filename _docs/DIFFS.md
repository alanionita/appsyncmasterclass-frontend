# Diffs vs original course

Keeping track of each changes vs original videos, code, or instructions

# 05-01-Setup_frontend_project

Diffs: 
- Vue3 setup instead of Vue2
    - vue-cli, used in the video, is now in maintenance mode
    - vite, is the prefered option for the toolchain
        - see migration docs from vue-cli (Vue2) to vite - https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/
    
- Used `npm create vue@latest` install wizard
    - Add-ons: Router, Vitest, ESLint, Prettier
    + Using the new scaffold tool already uses Vite (see above)
- Ran the following commands to see the app 
    - npm i
    - *   run format
    - *   run dev
- Navigates to url to confirm site

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-01-Setup_frontend_project

# 05-02-Configure_Tailwind

Diffs: 
- Install Tailwind using vite
- `npm install tailwindcss @tailwindcss/vite`
- within `vite.config.js`
    - import `tailwingcss` module from `@tailwindcss/vite` 
    - add it to .plugins list
- in `src/assets/main.css` 
    - add `@import "tailwindcss";`
- `npm run dev`
- in `src/App.vue`
    - add <h1> element with tailwind styling
- check the localhost version of the site 
    - is the <h1> showing?
    - is it styled correctly?

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-02-Configure_Tailwind