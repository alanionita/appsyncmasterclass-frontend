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

# 05-12-03-Root_page_add_escape_directive 

- Vue v3 directives:
    - should only be used when the logic is achieved via DOM methods
    - Vue has a built-in alias for the ESC key: `.esc`.
    - `v-on` is the built-in directive for events, which is uses the `@` shorthand
    - built-in directives like `v-on` handle clean up by default
- RootView.vue: massively simplified by improved framework features to a single line of code; because of this there's no need to create a custom directive

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-03-Root_page_add_escape_directive

# 05-12-04-Root_page_add_signup_step1 

Diffs: 
- Vue v3 recommends using the defineModel() macro models; output of a model is a ref, which can be updated in the same way with `.value`;
- CSS: used a flex container to refactor the step1 nav
        - reduced the amount of padding tweaks, more reliable
- CSS: used a flex column container for the form
        - easier to consistently style gaps
- CSS: Next button
        - refactored to use `:disabled` vue attribute setting instead of the classes
        - this allows the button to be fully unfunctional, whilst before click events would still be allowed regardless of the disabled styles
        - styles are now defined for the `disabled:` state
- HTML: improved the semantics, with a <form> and properly defined <input> and <label> elements

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-04-Root_page_add_signup_step1

# 05-12-05-Root_page_add_signup_step2 

Diff:
- declares a new `goTo(step)` fn in order to validate states before moving to a new 
- html & css: implements <fieldset> and in general tidies the styling to use generic rules, rather than minor adjustments
- Vue: also connects the checkboxes to models

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-05-Root_page_add_signup_step2

# 05-12-06-Root_page_add_signup_step3 

Diff: 
- added a new field for confirming the password
- add models for password and confirmPassword
- consent*: add defaults to all the consent models
- UI: adds eye icon for pwd visibility instead of reveal password link
- adds local `showPassword` state with ref()

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-06-Root_page_add_signup_step3

# 05-12-07-Root_page_add_signup_step4

Diff:
- Amplify: auth.signUp() requires attributes within options.userAttributes
- auth.signUp(): implemented in the Pinia state
- RootView: component has a handleSignUp methods that orchestrates the calls
- Needed to make sure that the module value are no longer reactive before sending them to AppSync

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-07-Root_page_add_signup_step4

# 05-12-08-Root_page_add_signup_step5 

Diff:
- My api auto-verifies users, to avoid email notification costs, most of the logic here will bypassed in real usage, but added the logic for reference
- stores/authentication: adds new methods to confirmSignUp, signUp, resendVerificationCode
- Amplify: new source locations for the apis and new api signatures in Amplify v2
- Root.vue: UI contains logic to display resend code message, shows Sign up status at the end of step4, contains new local states to keep track of isSignUpComplete

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-08-Root_page_add_signup_step5

# 05-12-09-Root_page_signup_review 

Diffs:
- amplify/hub: enables the hub to handle signIn events and routing
- handleSignUp: adds signIn features; for my API users are already confirmed, but logic should branch for APIs without auto-verify
- UI: step5 will be skipped now for if users are auto verified

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-12-09-Root_page_signup_review

# 05-13-Add_user_login_with_Amplify 

Diffs: 
- @components: adds components for InputText and InputPassword to improve reusability and page composability
- LoginView.vue: styles: replace element specific spacing with container spacing: leveraging gap-* vs element m* or p*
- LoginView.vue: semantics: used <form>, <fieldset>, <input> / <label>, instead of ambiguous tags (<div>)
- LoginView.vue: implements focus by exposing the focus directive to parent component; implemented `nextTick` within InputText component `focus()` and implemented as using await directive instead of a callback
- RootView.vue: implemented Login widget using components and reimplemented focus on email input from login

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-13-Add_user_login_with_Amplify

# 05-14-Configure_CI_CD_pipeline_with_Amplify

Diffs:
- Amplify setup: now requires auth with Github; install the Amplify App; narrow the repo access to `appsyncmasterclass-frontend`; return to Amplify deploy console; push a commit to repo if you can't see it in the list; select the repo from list and deploy the app;
- Amplify variables: since this app uses .env vars we also need to add these to the Amplify deployment`

Release: no release because it mostly involves console changes

# 05-15-Home_page_setup_and_styling_with_Tailwind 

Diffs:
- html5: implemented semantic elements and logical structures: lists
- css: prefered to implement parent>child styling rules over margin and padding rules defined on child components
- tailwind: resolved css override cause by font-awesome 'fa' class; not gone completely just worked around it; blocked by font-awesome paywall
- tailwind: used v4 definition for defining vendor layers (relevant fix for css class with 'fa' class from font-awesome)
- vue3: defined components and data structures with new apis; implemeted defineModel() logic
- styles: implemented sizing with and 8pt grid; also implemented 12-col layout from bootstrap (used by Twitter)
- styles: implemented atomic design system for components

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-15-Home_page_setup_and_styling_with_Tailwind

# 05-16-Home_page_loading_profile_data

Diffs:
-SideNav: add account dropdown with dummy local model; implemented dropdown state using ref(); added placeholder for signOut(); all previous dynamic values come from the local profile model; also improved html semantics
- SideNav: implements store actions with new API for handleLogout(), uses authStore
- stores/twitter: defined new store using Pinia api; integrated it within the authentication store at signIn()
- stores/auth: added verifyAuth() method to replicate the check to Amplify and the store setting; new implementation using Pinia api not vuex; similar to the hub listener logic for 'signedIn' event
- loginUserIfAlreadyAuthenticated(): implemented as a component function inside HomeView; calls authStore.verifyAuth() with the path (reactive); path is used to decided whether to route or not
- Various refactors of names and labels and usability in an effort to keep things DRY
- styles: made sure styles are sticking to an 8pt grid / divisible by 8

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-16-Home_page_loading_profile_data

#  05-17-Home_page_posting_a_new_tweet

Diffs:
- stores: created a new timelineStore instead of using a big store with nested properties; paradigm avoid any update lifecycle issues where some keys are behind / unhydrated
- store.getMytimeline: data fetching method goes on the new store for TwitterTimelines; 
- graphql: updated service api to include a new controler for getMyTimeline, updated the query to fetch tweeit.profile values, updates .query() util to handle query variables
- HomeView: implemented the new timeline store and renders HTML elements using the 
- HomeView: implemented the tweet logic for disabling submit based on newer model patterns

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-17-Home_page_posting_a_new_tweet

# 05-18-Home_page_rendering_the_timeline

Diffs:
- components: creates within the Atomic Design structure
- components: reactive props declares with newer VueJS v3 syntax 
- HomeView: imports of the components done using VueJS v3 patterns
- filters: filters API has been deprecated from VueJS.v3; implemented via `app.config.globalProperties.$filters` in main.js; identical in function
- filters/timeago: used `date-fns` instead of `moment` (deprecated); implemented distanceFrom(), formatting(), and custom locale logic for producing like for like date results eg. Now, 15s, 1m, 3h 

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-18-Home_page_rendering_the_timeline

# 05-19-Home_page_adding_reply_retweet_like_and_unlike

Diffs:
- like/unlike: adds like functionality using Tweet component handleTweetBtn(), and graphql.controllers ; debouncing will need to added here also 
- retweet/unretweet: used the same pattern
- reply: controller used the same pattern; required getMyTimeline() query update to include inReply* values for Reply type
- reply: Tweet component used custom v-on event for hiding instead of :showReply.sync(); in addition to a 2nd prop binding for replyUI
- reply: ReplyOverlay makes use of 2 API styles for emit, because $emit is not available within <script setup>; also makes use of custom v-on event for 'hide'; uses new Pinia state patterns for profile and timeline state; where the timeline state is used to update the HomeView timeline once the replyUI is closed;
- state: actions were not included instead, rather opted for component-local handlers calling GraphQL controllers and state functions which call GraphQL controllers (timeline updates)
- retweet component: instead of using the Auth package from amplify directly, it checks the user value from the authStore
- retweet component: since the retweeting now creates a new component, a timeline refresh is required on the retweet handler on Tweet comp

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-19-Home_page_adding_reply_retweet_like_and_unlike

# 05-20-Profile_page_setup_and_styling_with_Tailwind 

Diffs:
- layout: since Profile and Home views share a layout, a new component/template was created; uses names slots to fill in content in the main column; implemented in HomeView and ProfileView
- ProfileView: implemented using the above mentioned layout
- router: implemented router and route logic via the use* hooks
- routing: corrected logic where route to Home was using an undeclared param; VueJS antipattern as seen here - https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-20-Profile_page_setup_and_styling_with_Tailwind

# 05-21-Profile_page_rendering_profile_details 

Diffs:
- store: already had a separate store for twitterProfile; add the getters to that; also uses 'date-fns' instead of 'moment' for date conversion
- UI: removed specific margin and padding, in favour of responsive containers and gaps
- ProfileView: instead of specific dynamic elements, split up the ProfileView to render to sub components for each type of profile
- stores: instead of updating the same "profile" store, decided to have 2 Pinia stores (similar signature) for their and my profile
- ProfileView: checks route.params.screenName to decide which view to render
- ProfileView: implements 'onBeforeRouteUpdate' because for each route with /:screenName we render the same component; this causes reactivity issues, mainly a stale UI; logic rechecks the 'to' navigation and decides which route should be used

Release: