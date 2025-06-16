<script setup>
import { toRefs } from 'vue';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import { formFields } from '@/services/amplify/config';
import "@aws-amplify/ui-vue/styles.css";

const { toSignUp } = toRefs(useAuthenticator());

</script>

<template>
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
<style>
@media (min-width: 1024px) {
    .login {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>