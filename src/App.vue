<script setup>
import { toRefs } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

const { route, user, authStatus, signOut, toSignUp } = toRefs(useAuthenticator());

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Username (Email)'
    },
  },
  signUp: {
    username: {
      label: 'Username (Email) *',
      placeholder: 'Please enter your email',
      isRequired: true,
      order: 1
    },
    name: {
      label: 'Name *',
      placeholder: 'Please enter your name',
      isRequired: true,
      order: 1
    },
    password: {
      label: 'Password *',
      placeholder: 'Please enter your password',
      isRequired: true,
    },
    confirm_password: {
      label: 'Confirm Password *',
      isRequired: true,
    },
    phone_number: {
      label: 'Phone number *',
      placeholder: 'Please enter your phone number',
      dialCodeList: ['+44'],
      isRequired: true
    }
  }
};

</script>

<template>
  <template v-if="authStatus === 'unauthenticated'">
    <authenticator :form-fields="formFields">
      <template v-slot:sign-in-footer>
        <div style="text-align: center">
          <button @click="toSignUp" class="amplify-button amplify-field-group__control" data-fullwidth="false"
            data-size="small" type="button" style="font-weight: normal">
            Sign Up
          </button>
        </div>
      </template>
    </authenticator>
  </template>
  <template v-if="authStatus === 'configuring'">
    <button @click="auth.signOut">Loading...</button>
  </template>
  <template v-if="authStatus === 'authenticated'">
    <header>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <h1>Hello {{ user.username }}!</h1>
    <button @click="signOut">Sign out</button>

    <RouterView />
  </template>
</template>

<style scoped>
.nav {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
