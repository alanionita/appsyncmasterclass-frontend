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

# 05-03-Configure_fontawesome

Diffs: 
- Different flow to create fontawesome script, follow online flow, but added to the app in the same way described
- Codebase: more refactoring changes because I use the router example 

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-03-Configure_fontawesome

# 05-04-Integrate_backend

Diffs: 
- Amplify requirements: adds boilerplate code to `index.html` and `vite.config.js`, recommended by new Amplify UI docs
- Adds AppSync methods using Amplify CLI codegen features
- Packages: did not use `graphql-tag` as requested by course; added `aws-sdk` since it seems to be a requirement for Amplify; used `@aws-amplify/ui-vue` v4, and `aws-amplify` v6
- main.js: Amplify config required a different structure, also implemented sensitive info via environment variables
- Did not define GraphQL calls within `lib/backend`; used the `@amplify-cli` command to codegen the methods from the API 
```
npx @aws-amplify/cli codegen add --apiId APPSYNC_API_ID --region APPSYNC_API_REGION
```
- Did not use the `graphql-tag` module because the `Amplify.API.graphql()` method supports strings  
- services: adds Amplify config file within services/amplify; config is different than the recommended config in the video
- main.js: adds logic to store Cognito tokens in sessionStorage
- App.vue: configuration of the Amplify UI form fields is done via `formFields {}` config object; adds special designation for phone_number dialcode; order is defined with the `order` key; supports much more config that used here; `type` is not required if it both matches the key and the Cognito mapping, see docs for list
- serivices/graphql: adds utils and controller into services/graphql; utils handle common GraphQL tasks, instantiates the client, handles auth checks; controllers call each method and handle any post-processing

Release: https://github.com/alanionita/appsyncmasterclass-frontend/compare/05-03-Configure_fontawesome...05-04-Integrate_backend

# 05-05-Configure_routing

Diffs:
- Routing: since I used the latest `npm create vue@latest` at the beginning I already had a router
- Since the graphql lib wasn't implemented, decided to call it on the HomeView and render the data from getMyProfile

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-05-Configure_routing

# 05-06-Add_public_pages

Diffs:
- Followed the requested changes, but commented out previous <authenticator> code; confusing that we're not dealing with an app that's not got the authenticator after working to add it

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-06-Add_public_pages

#  05-07-Add_router_guard 

Diffs: 
- router/auth: rename this file vs the video; getting the authenticated user is different in newer versions of `aws-amplify`; here leveraging authenticated sessions via `fetchAuthSession()` from `aws-amplify/auth` module; sessions are more reliable because they are an api that can be called without auth, unlike `getCurrentUser()` a parallel to the api in the video
- <authenticator>: left the RootView untouched and added the Amplify <authenticator> ui to the LoginView instead, where it should be really
- Amplify: moved `formFields` to services/amplify

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-07-Add_router_guard

# 05-08-Configure_multimodule_vuex_store

- Vuex: replaced with Pinia, since it's officially recommended as transition from Vuex
- Pinia: Pinia states are isolated by default, so none of the module definition and registration is required; equally Pinia stores are already scoped so there's no need to `export default { namespaced: true}`; Pinia API for has a createPinia that needs to be passed to Vue via the `.use()` directive
- Vuex: unlike Vuex which is a nested state, Pinia is a flat state

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-08-Configure_multimodule_vuex_store

# 05-09-Add_authentication_module

Diffs:
- Pinia: doesn't require mutation, just actions; getters make use of this.*; actions no longer use `state.*` just `this.*`; removes the need to use `commit(LABEL)` boilerplate - Pinia uses direct calls; actions have direct state access; defining the getters and actions and state in one file, will split up into separate files when the state grows
- Amplify: signOut api has a different location in 'aws-amplify' v6, `import { signOut } from 'aws-amplify/auth';

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-09-Add_authentication_module

#  05-10-Add_store_to_UI_components 

Diffs:
- Ended up having a lot of issues with the reactivity between @aws-amplify/ui-vue and the Pinia auth store
- Found a reliable solution using the Amplify Hub listener, an internal event listener API
- service/amplify/hub: defines the auth listener and registers it to listen to all auth events; listener is then checking for 'signIn' event, fetching the current Amplify user, and sets that user within Pinia authentication store; it also redirects to `/home` (protected route) and cancels the listener; the canceling may be premature, but we mostly care about the 'signIn' event in this case
- stores/authentication: in addition to login() logic it also contains methods to start and stop the Amplify Hub listener
- *View.vue: the views themselves only care about starting the auth listener onMount, reducing some of the complexity
- LoginView.vue: still relies on reactive values from useAuthenticator (Amplify UI), but here they're only used in the UI, rather being required for usage within Pinia

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-10-Add_store_to_UI_components

# 05-11-Root_page_styling_with_tailwind 

Diffs:
- packages: using Tailwind v4 (not v2), so a few things have changed
- tailwind.config.js: no longer loaded by default, but still supported for backwards compatibility; chose to not use it see https://tailwindcss.com/docs/upgrade-guide#using-a-javascript-config-file
- theme: color variables are defined in `src/assets/main.css` using the @theme directory; all colors are defined as CSS variables; all initial config colours are removed
- theme: imported Roboto font from Google Fonts to show the font customisation in v4
- theme: container "To customize the container utility in v4, extend it using the @utility directive"; to center used `margin-inline: auto; padding-inline: 2rem;`; will need to be implemented in html via the @container util
- Root.vue: adds semantic HTML tags where possible
- Root.vue: replaced the click handlers for routing via <RouterLink>; wraps each button with an <a> so added a bit more styling;

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-11-Root_page_styling_with_tailwind

# 05-12-01-Root_page_add_modal 

Diffs:

- Vue: in v3 Composition API is recommended with reactive states
- RootView: used ref() for `displayModal` state with custom functions to `showModal(), hideModal()`
> fault in the course re;eases means that 05-12-01 and 05-12-02 releases are combined; they are separate here

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-01-Root_page_add_modal

# 05-12-02-Root_page_add_modal

Diffs:

- Vue: using Pinia store instead vuex
- src/stores: moved existing `Root.vue` local store to Pinia stores; updated HTML to trigger Pinia actions, and depend on Pinia getters

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-02-

