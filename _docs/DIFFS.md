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
