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

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-21-Profile_page_rendering_profile_details

# 05-22-Profile_page_rendering_profile_timeline 

Diffs:
- HomeView: already using prop.tweets with <Timeline> component
- HomeView: created a fetchPageData() to house all bff-type calls for data required by the UI
- ProfileView: further refactored to break up into components and improve legibility; also refactored in order to make additions easier
- ProfileView: implements the timeline fetching based on whether current accessed profile is mine or theirs; switching login is in the component not within the store

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-22-Profile_page_rendering_profile_timeline

# 05-23-Profile_page_edit_profile_details

Diffs:
- Security and best practice: implements the fetching and uploading using signed urls and private bucket files; connects to changes in the backend for ; configures the app to use Cognito Identity Pools and private S3 bucket
- Overlay: created a generic wrapper component that handles the show/hide, close, and keydown for ESC; implemented this wrapper within Setup*/EditProfileOverlay; uses new patterns for emitting events from child components, heavy use of props and refs to show/hide; implements some of the modal UI for better consistency and less code duplication across Edit* and Setup* variations ; uses newer style `@keydown.esc` instead of the actual event and key definition
- SetupProfileOverlay: does less state updates, because of myProfile store implementation of changeProfile, which updates myProfile; actions implemented with new vue.v3 api and Pinia; 
- EditProfileOverlay: to avoid any race conditions, fileChange() leveraged the uploadData() api from Amplify.storage; offerrs the ability to show progress in the future
- ProfileHeaderActions: required fallback for <img> errors whenever a signed GET url is expired; refreshes the GET url
- Dates: uses `date-fns` package since `moment` is no longer maintained, to convert and parse dates; shows correct dd-mm-yyyy format on the UI, but saves in AWSDate format yyyy-mm-dd;
- UI: Image elements show a flashing skeleton placeholder whilst <img> requests load
- ReplyOverlay: implemented key events using vue.v3 v-for (@) shorthand directive, instead of direct to DOM event listeners; implemented focus using refs api
- CSS styling: simplified to use x/y rules and responsive containers and rules
- CSS styling: implements grid layouts for layer stacks of elements, over absolute positioning
- Docs: adds JSDocs where possible to explain inputs, outputs, and behaviors

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-23-Profile_page_edit_profile_details

# 05-24-Profile_page_following_and_unfollowing 

Diffs
- store/twitterTheirProfile: adds logic to handle presigned url; refactored older logic and more abstractions into utils/*
- UI: Tweet, adds link to /profile/* to the Tweet.screenName UI element
- UI: Profile back button navigation logic added within ProfileHeader because of a different abstraction to source material, implemented via links instead of <button> onClick for valid semantics 
- ProfileDetails: Followers and Following navigation implemented within ProfileDetails components, since this is the local abstraction; routes don't need to define webpackChunkName (default); views and routing implemented in a Composition API fashion
- State: calls to update followers and following implemented within `updatePageData()` method on each view vs `created()` implementation; state methods for getFollowing and getFollowers also update the respective counts
- GraphQL: controllers make the requests to getFollowing, getFollowers, follow, unfollow
- components/FollowButton: component is an abstracted version of the profile follow button; includes logic for showing if someone is following you and whether you should follow them back - feature implemented via nested Pinia states
- components/User: implements direct call to gql.follow and unfollow controllers, bypassing the state methods altogether. Why? There's no theirProfile here, just a list of multiple profiles with objects for each. TheirProfile is a singular state thus incompatible

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-24-Profile_page_following_and_unfollowing

# 05-25-UI_add_infinite_scrolling

Diffs:
- vScrollend: renamed the directive, defined it in a setup style pattern; opted to keep the directive locally scoped, thus not requiring global registration
- Implements the tweet loading via `loadMoreTweets()` helper defined at *View level

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-25-UI_add_infinite_scrolling

# 05-26-UI_add_loading_indicator 

Diffs:
- loader state: implemented via a new Pinia store for UI elements, including the loading values; the Loader component now show/hides based on it; data calls now trigger the loading value from the UI state; adds a debounce to make the loader stay alive for a natural amount of time
- Home: fixes issue with multiple tweet posting on double-click

Release:https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-26-UI_add_loading_indicator

# 05-25-1-UI_add_infinite_scrolling

Usage:
- consider with 05-25
- compare against 05-26

Diffs: 
- store/tweetTimeline: implements the loadMoreTweets entirely within the store; makes sure that getMyTimeline and getTweets don't expand the tweets list, just replace it with latest 10 items; overall leading to more predictable results across testing scenarios
- *View: implementation allowed the removal of fetching related data from the Home and ProfileViews

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-25-1-UI_add_infinite_scrolling

# 05-24-1-Profile_page_following_and_unfollowing 

Usage:
- consider with 05-24
- compare against 05-25-1

Diffs:
- FollowButton: fixes rendering of all states; improves how stores contain information about logged in user being followed/following another user
- ProfileView: fixes behaviour on reload and direct navigation to the page; moves a the auth to run per routing; adds new ui.ownProfile in the same flow to make sure that ownProfile is know at every step

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/05-24-1-Profile_page_following_and_unfollowing

# 07-01-Search_page

Usage:
- consider with backend/07-01
- compare against 05-24-1

Diffs:
- layouts/ThreeCols: implements dynamic rendering for 'search' and implments it on all existing pages
- store/search: implemented the store using Pinia; store now contains handleSearch, changeMode, as well as the query, mode, results, and nextToken; uses the storeToRefs patters; loadMore is also implemented here in a similar fashion to loadMoreTweets; also implemented a new custom reset() method to help with state clean up; implements firstLoad getter to allow the SearchView to render data on reload or direct nav, via URL
- urls: continues to rely on route.query for data transfer, using hook patterns
- ui: makes more use of grid css styling and reduces specific spacing rules for blanket rules like gap; makes use of the store/ui for loading
- backend: adds new value to SearchPageResults type, totalCount; used in store/search.loadMore(), actings as flag for no more items available
- SearchResults: implements semantic tags for the list: <ul>, <li> ; updates the v-if logic to correctly render <User> and <Tweet> components ; propagates the semantic tag for lists across the app;

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/07-01-Search_page

Backend release: https://github.com/alanionita/appsyncmasterclass-backend/releases/tag/07-01-Adds-search-total-count

# 07-02-Hashtag_page

Usage:
- consider with backend/07-02
- compare against 07-01

Diffs:
- HashtagView: largely the same new pattern from above; introduces a new comp for SearchHashtagResults since they are store aware
- store/searchHastags: in the spirit of Pinia, keeps the stores, small and context aware, instead of using an existing store to house hashtag logic and results; similar API to store/search
- SearchHashtagResults: directly dependent on store/searchHashtag results vs prop-drilling; created a separate component instead of reusing SearchResults; adds some margin-bottom to ensure scroll exists on 10 list items
- backend: adds new value to SearchPageResults type, totalCount; used in store/searchHashtags.loadMore(), actings as flag for no more items available
- util/urls: implemented the linkify logic as a util not a directive, used with `v-html` and refs to take advantage of Vue v3 reactivity 
- ProfileView: implemented with a new ui store property for `noProfile` and nested store method triggering; renders a new template when noProfile is detected vs multiple small changes to the main template; "NoProfile" ui features a simplified look that does not contain interactive elements that cannot be interacted with, at the loss of like-for-like authenticity

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/07-02-Hashtag_page

Backend release: https://github.com/alanionita/appsyncmasterclass-backend/releases/tag/07-02-Hashtag_page

# 07-03-Notifications_page

Usage:
- consider with backend/07-03
- compare against 07-02

Diffs:
- NotificationsView: uses the existing ThreeCol template, reused across all other views in this remix of the original codebase; implements the notifications store via hooks
- components/*: favours components abstraction and reusability; introduces the NotificationsList which works for both modes; introduces the NotificationsListEmpty fallback ui; NotificatinListItem to further abstract logic per notification; NotificationBadge to show the notification amounts as a badge
- components/SidebarNav: abstracted the notification amound to a NotificationBadge component
- styles: favours declarative style, focusing on containers and item rules; refactors positioning based on micro-adjustments of padding / margin and repeated styles; vastly simplifies styling rules and removes redudant styles
- html: favours declarative style, prefering semantic elements vs <divs>; adds logical lists and sections where needed; removes redundant nested <divs> 
- stores: implements notifications as a Pinia store, with all related props stored within; implements subscribe(), unsubscribe(), reset(), and helpers; methods use other store within; notification store methods later integrated in authentication store methods for login, logout, signin, verifyAuth
- services/apollo: introduces the Apollo Client module with official aws packages for linking with Appsync; aims to move away from `aws-appsync` package towards Apollo use; in the process refactors and removes the need for using graphql controllers and utils; refactors all existing controllers into one big Apollo Client class; 
- router: initialises the new Apollo Client within the auth middleware

Release (backend): https://github.com/alanionita/appsyncmasterclass-backend/releases/tag/07-03-Notifications_page

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/07-03-Notifications_page

# 07-04-Messages_page
# 07-05-Direct_messages
# 07-06-Messages_integration

> Note: 
> In course repo `07-04` contained all the changes for subsequent releases `07-05`, `07-06`
> Implemented here in the same way

Usage:
- consider with backend/07-03
- compare against 07-03


Diffs:
- routing: 
    - Video and original code recommends the use of an "artificial" param, a param that's not effectively used in the path; this represents a routing anti-pattern and is now guarded against in Vue Router - https://github.com/vuejs/router/commit/e8875705eb8b8a0756544174b85a1a3c2de55ff6
    - New implementation uses a query parameter for `screenName` which is then use to build up the conversationId (akin to conversation param); this query parameter `/messages?screenName=""` reads as 'Messages between me and screenName'
- html: 
    - Updates html semantics, visual lists being html list
    - Implements link states active and unavailble with native html and css
    - Wont implement the tailwind settings change for maxHeight.full, since it represents an anti-pattern
    - Wont implement styling changes to do with height changes; the use of existing templates, and responsive patterns was enough to pin the elements to the screen
- components: Generally abstracted parts of the old UI into single purpose, reusable components; making it easier to reason and update code
- store/*: 
    - Video recommends the use of a deeply nested store
    - Newer guidelines recommend abstraction and flat stores to avoid reactivity issues
    - New implementation uses entity based stores, component-based stores, as well as existing stores
    - New implementation favours flat states, single-purpose stores, nested instances of one store within another
- view/MessagesView: 
    - Implemented using existing layout pattern, but via a new columnar layout and template <TwoCol/>
    - Original `selected()` logic largely covered by `store/conversations.new`
- components/SideNav: 
    - MessageBadge implemented in modular way similar to Notifications badge
    - Badge state moved to store/ui since it represents 2 entities
- filters/*: 
    - Implemented using `date-fns` date library instead of `moment` (deprecated)
    - Refactors the .timeago() filter to use strict method from `date-fns`
- directives/*: previously renamed to `vScrollend` to avoid clashes with `v-scroll`; refactored to use a switch case
- components/NewMessageOverlay: 
    - Implments existing `templates/Overlay` with a slight refactor for class overrides from within the child component
    - Show/hide state included in store/ui, and passed to <Overlay/> which handles key presses and click outside of the main overlay element behaviour
    - Against general trend, opted for less abstraction in this component, favouring local file legibility over abstraction (justified by the individual nature of this component)
    - Implements helper components <Image/> and <Linkify/>
    - Adds onMount focussing to the search box, and expanded 'Next' UI button rules for active and disabled
    - Prefers the use of stores vs emits and props, reducing boilerplate 
    - Wont implement @selected, favouring state usage; 
    - store/newMessage.selectedUsers implemented via Map to satisfy unique list requirement
    - search implmented as a <form/> with @submit event handling
- UserNewMessage: Bypassed the creation of this component, most of ui is included in <NewMessageResults/>, and the logic for selecting a user is housed within store/newMessage
- store/searchUsers: 
    - Handles the search by 'People' only
    - Represents some duplication of the store/search logic, but created in order to simplify legibility
    - Used in <NewMessageOverlay/>
- components/ResultsNewMessage: 
    - Renamed to `<NewMessageResults/>`
    - Implements the `store/searchUsers` and `*/newMessage`
    - Reuses <Overlay/> template for modal behaviour and core styles
    - Implements semantic html structures where possible: <form/>, <ul/>, <li/>
    - Implements a dynamic user selection area that supports for than 1 users (BE only supports 1-2-1 conversations); including a feature to remove added selection
    - Won't implement the `user.followedBy` restriction, despite it being a Twitter business logic rule
- components/MessagesList: 
    - Navigates to /messages done using a query param of screenName
    - Avoids the antipattern of unused route.params (see above)
    - scrollToMe() and helper renamed to `scrollAnchor` and `handle*`
- store/notifications: 
    - When a DM notification is received the badge and all the new stores (conversations, messages) are optimistically updated
    - There are two UI states that are receive updates: the generic ui/newMessageBadge (used in Sidebar), and a conversation specific hasNewMessage badge
    - Follows UX rules: 
        - Active (not set) 
            - New notification updates both badges
            - Optimistically updates just conversations
        - Active (set) 
            - New notification bypases badge updates,
            - Optimistically updates both conversation, and messages
- [store/messages, */conversations]: 
    - Handles the fetching of data using similar pattern `.list()` and `.listMore()`
    - Implement backend calls via the store/appsync api
    - Fetching states are similar for consistenty: 
        - [LIST]    => data
        - nextToken => used for pagination
        - limit     => limits each fetch batch, max of 20,25
        - hasMore   => limits the repeat fetch calls on scroll
- store/conversations: 
    - Contains the `.setActive()` (linked to ); different signature but works the same as _SET_ACTIVE
    - Implements `.list()` (linked to mutations/TWITTER_CONVERSATIONS_LOAD)
    - `.new()` (linked to mutations/TWITTER_MESSAGES_NEW)
    - TWITTER_CONVERSATION_ACTIVE_SET represented via .setActive and flat active states [activeConversationId, activeOtherUserId, activeOtherUserScreenName, activeConversationIsNew] - 
    - Opted for flat states vs deep nests
    - Wont implement `conversationSet`
        - New logic updates each conversation with new expanded fields
        - Expanded fields: 
            - hasNewMessages => shows whether a conversation has new messages (UI element)
            - isNew          => shows if a conversation has no message, ie. a new conversation (UI element)
- store/messages: 
    - Contains `.list()`, `.listMore()` (related to TWITTER_MESSAGES_LOAD and *_LOAD_MORE)
    - Contains `.send()` (related to TWITTER_MESSAGES_SEND): calls the backend and optimistically updates messages list and badges
    - Resets the conversation state of .isNew() for new conversations (ie. a conversation without any messages)

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/07-04-Messages_page

# 09-01-Mobile_styling

General:
- list of views updated for responsive styles: Root, Login, Home, Profile, Following, Followers

Tailwind config: 
- Breakpoints defined using v4 css variable syntax and @them
- Breakpoints defined in rem for max responsiveness and compatibility, calculated with a base of 16px

view/Root:
- Adds mobile styles as requested
- Refactors elements using semantic HTML elements
- Refactors to use responsive contaienrs vs floating elements; allowing the removal of styling-specific elements
- Standardises the padding and gaps to an 8pt grid; where possible uses the '12 col grid', made famous by twitter - improving the overall symmetry of the page

Skipped:
- Messages view since it requires a bit more thought and research

Release: https://github.com/alanionita/appsyncmasterclass-frontend/releases/tag/09-01-Mobile_styling

# 09-02-PWA

- @vue-cli/*: no longer considered the recommended approach for new projects, favouring vite builds instead 
- Instead installed `@vitejs/plugin-vue` and configured it in vite.config 
- vite.config: import the VitePWA fn from `vite-plugin-pwa` and calling it within `config.plugins[..., ViewPWA()]` was enough to pass the test; all assets rendered, no further changes needed; 
    - Added assets and config to match [PWA Minimal Requirements ](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html) and provide more parity to corresponding release
+ Does represent a pattern change: the original includes a `public/manifest` which can later be expanded upon; whereby in this version, the manifest is generate and injected into the app at the build step; further config required to replicate the original behaviour and turn off the generation and injection of the manifest see -> [Service Worker Strategies And Behaviors ](https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html)

Release: