<script setup>
import { useAuthStore } from '@/stores/authentication';
import { useSignupStore } from '@/stores/signup';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router'

const authStore = useAuthStore();
const signUpStore = useSignupStore();

const showPassword = ref(false);
const localIsSignUpComplete = ref('');
const localNextStep = ref('')
const resendConfirmMsg = ref('');

const name = defineModel('name', { required: true });
const email = defineModel('email', { required: true });
const phone = defineModel('phone', { required: true });
const birthdate = defineModel('birthdate');
const consentNotifications = defineModel('consentNotifications', { required: true, default: '' });
const consentVisibility = defineModel('consentVisibility', { required: true, default: '' });
const consentAds = defineModel('consentAds', { required: true, default: '' });
const password = defineModel('password', { required: true });
const confirmPassword = defineModel('confirmPassword', { required: true });
const verificationCode = defineModel('verificationCode');

onMounted(() => {
  if (!authStore.listener && !authStore.loggedIn) {
    authStore.startListener();
  }
})

function goTo(step) {
  switch (step) {
    case 'step2':
      if (!name && !email && !birthdate && !phone) {
        return;
      }
      signUpStore.set(step)
      break;
    case 'step3':
      if (!consentAds && !consentNotifications && !consentVisibility) {
        return;
      }
      signUpStore.set(step)
      break;
    case 'step4':
      if (!password && !confirmPassword) {
        return;
      }
      if (password && confirmPassword) {
        if (password.length > 8 && confirmPassword.length > 8) {
          if (password !== confirmPassword) {
            return;
          }
        }
      }
      signUpStore.set(step)
      break;
    default:
      signUpStore.set(step);
  }
}

function togglePwdVisibility() {
  showPassword.value = !showPassword.value
}

async function handleSignUp() {
  try {
    const signUpResp = await authStore.signUp({
      email: email.value,
      name: name.value,
      password: password.value,
      phone: phone.value,
      birthdate: birthdate.value
    });
    if (signUpResp.isSignUpComplete) {
      const { nextStep } = await authStore.signIn({
        email: email.value, password: password.value
      })
      console.info(JSON.stringify(nextStep));
    } else {
      console.info(JSON.stringify(signUpResp.nextStep))
      goTo('step5');
    }
  } catch (err) {
    alert('Error with sign up!')
    console.error('Err [handleSignUp] : ' + err.message)
    await authStore.logout()
  }
}

async function handleCompleteSignUp() {
  try {
    if (!verificationCode) { throw Error('Missing verification code') }
    const {
      isSignUpComplete,
      nextStep
    } = await authStore.completeSignUp({
      verificationCode: verificationCode.value,
      email: email.value,
      password: password.value
    })

    if (isSignUpComplete) localIsSignUpComplete.value = isSignUpComplete;
    if (nextStep) localNextStep.value = nextStep
    showSignUpComplete()
  } catch (err) {
    alert('Error confirming verification code!')
    console.error('Err [handleCompleteSignUp] : ' + err.message)
    return err
  }
}

function generateResendMsg({ destination, deliveryMedium }) {
  const msg = `A confirmation code has been sent to ${destination}. Please check your ${deliveryMedium} for the code.`
  this.resendConfirmMsg.value = msg;
}

async function resendVerificationCode() {
  try {
    if (!verificationCode) { throw Error('Missing verification code') }
    const { destination, deliveryMedium } = await authStore.resendVerificationCode(email.value)
    generateResendMsg({ destination, deliveryMedium })
  } catch (err) {
    alert('Error resending verification code!')
    console.error('Err [resendVerificationCode] : ' + err.message)
    return err
  }
}

function showSignUpComplete() {
  const processKeys = (acc, key) => {
    acc += `${key} is [${localNextStep.value[key]}]`
    return acc;
  }
  if (localIsSignUpComplete.value) {
    alert("Sign up status complete!")
  } else {
    const msg = Object.keys(localNextStep.value).reduce(processKeys, '')
    alert(`Next steps are: ${msg}`)
  }
}

</script>

<template>
  <main class="flex w-full h-screen" @keyup.esc="signUpStore.reset()">
    <section class="flex w-1/2 bg-blue">
      <div class="flex items-center justify-center w-full h-full">
        <div class="flex flex-col">
          <div class="flex items-center">
            <i class="fas fa-search text-white text-2xl p-4"></i>
            <p class="text-white font-semibold text-xl">Follow your interests</p>
          </div>
          <div class="flex items-center">
            <i class="fas fa-user-friends text-white text-2xl p-4"></i>
            <p class="text-white font-semibold text-xl">Hear what people are talking about</p>
          </div>
          <div class="flex items-center">
            <i class="fas fa-comment text-white text-2xl p-4"></i>
            <p class="text-white font-semibold text-xl">Join the conversation</p>
          </div>
        </div>

      </div>
    </section>
    <section class="flex items-center justify-center w-1/2 h-full">
      <div class="flex flex-col w-1/2 font-semibold gap-5">
        <i class="fab fa-twitter text-blue text-4xl"></i>
        <p class="text-3xl mb-12">See what's happening in the world, right now!</p>
        <p>Join Twitter today.</p>
        <button @click.prevent="goTo('step1')"
          class="w-1/2 rounded-full bg-blue font-semibold text-lg text-white p-4 hover:bg-white hover:text-blue hover:border hover:border-blue">
          Sign up
        </button>
        <RouterLink to="/login" class="w-1/2">
          <button
            class="w-full rounded-full border border-blue bg-white font-semibold text-lg text-blue p-4 hover:bg-blue hover:text-white ">
            Log in
          </button>
        </RouterLink>

      </div>
    </section>

    <section v-if="signUpStore.getStep !== ''"
      class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div class="absolute w-full h-full bg-gray-900 opacity-50" @click.prevent="signUpStore.reset()">
      </div>
      <form class="modal-main max-w-md bg-white w-11/12 mx-auto rounded-lg z-3 overflow-y-auto max-h-full">
        <fieldset v-if="signUpStore.getStep === 'step1'">
          <div class="flex gap-4 justify-between p-4">
            <div class="flex-2 flex justify-center">
              <i class="fab fa-twitter text-blue text-4xl"></i>
            </div>
            <button @click.prevent="goTo('step2')"
              class="rounded-full bg-blue font-semibold text-white px-8 py-4 hover:bg-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!name && !email && !birthdate && !phone">Next</button>
          </div>
          <div class="flex flex-col gap-4 px-8">
            <p class="text-2xl font-semibold">Create your account</p>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="name" class="text-dark">Name</label>
              <input v-model="name" id="name" name="name" class="w-full bg-lightblue text-lg" type="text">
            </div>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="email" class="text-dark">Email</label>
              <input v-model="email" id="email" name="email" class="w-full bg-lightblue text-lg" type="text">
            </div>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="phone" class="text-dark">Phone number</label>
              <input v-model="phone" id="phone" name="phone" class="w-full bg-lightblue text-lg" type="text">
            </div>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="birthdate" class="text-dark">Date of birth</label>
              <input v-model="birthdate" id="birthdate" name="birthdate" class="w-full bg-lightblue text-lg"
                type="text">
              </input>
            </div>
            <p class="text-dark">* This will not be shown publicly. Confirm your own age, even if this account is for
              business, a pet, or something else.</p>
          </div>
        </fieldset>
        <fieldset v-if="signUpStore.getStep === 'step2'">
          <div class="flex gap-4 justify-between p-4">
            <button @click.prevent="goTo('step1')"
              class="rounded-full bg-lightblue font-semibold text-blue px-8 py-4 border border-blue hover:bg-blue hover:text-white disabled:opacity-50 cursor-not-allowed">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="flex-2 flex justify-center">
              <i class="fab fa-twitter text-blue text-4xl"></i>
            </div>
            <button @click.prevent="goTo('step3')"
              class="rounded-full bg-blue font-semibold text-white px-8 py-4 hover:bg-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="consentNotifications === '' && consentVisibility === '' && consentAds === ''">Next</button>
          </div>
          <div class="flex flex-col gap-4 px-8">
            <p class="text-2xl font-semibold">Customise your experience</p>
            <div>
              <p class="text-xl font-semibold mb-2">Get more out of Twitter</p>
              <div class="flex justify-between items-top mb-2 py-4">
                <label for="notifications" class="text-dark">Receive email about your Twitter activity and
                  recommendations.</label>
                <input v-model="consentNotifications" id="notifications" name="consent" true-value="yes"
                  false-value="no" class="m-2 w-8 h-8 text-blue" type="checkbox">
              </div>
            </div>
            <div>
              <p class="text-xl font-semibold mb-2">Connect with people you know</p>
              <div class="flex justify-between items-top mb-2 py-4">
                <label for="visibility" class="text-dark">Let others find your Twitter account by email address.</label>
                <input v-model="consentVisibility" id="visibility" name="consent" true-value="yes" false-value="no"
                  class="m-2 w-8 h-8 text-blue" type="checkbox">
              </div>
            </div>
            <div>
              <p class="text-xl font-semibold mb-2">Personalised ads</p>
              <div class="flex justify-between items-top mb-2 py-4">
                <label for="ads" class="text-dark flex-1">You will always see ads on Twitter based on your Twitter
                  activity.
                  When this setting is enabled, Twitter may further personalize ads from Twitter advertisers, on and off
                  Twitter, by combining your Twitter activity with other online activity and information from
                  partners.</label>
                <input v-model="consentAds" id="ads" name="consent" true-value="yes" false-value="no"
                  class="m-2 w-8 h-8 text-blue" type="checkbox">
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="signUpStore.getStep === 'step3'">
          <div class="flex gap-4 justify-between p-4">
            <button @click.prevent="goTo('step2')"
              class="rounded-full bg-lightblue font-semibold text-blue px-8 py-4 border border-blue hover:bg-blue hover:text-white disabled:opacity-50 cursor-not-allowed">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="flex-2 flex justify-center">
              <i class="fab fa-twitter text-blue text-4xl"></i>
            </div>
            <button @click.prevent="goTo('step4')"
              class="rounded-full bg-blue font-semibold text-white px-8 py-4 hover:bg-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!password">Next</button>
          </div>
          <div class="flex flex-col gap-4 px-8">
            <p class="text-2xl font-semibold">You'll need a password</p>
            <div class="flex flex-col gap-4">
              <p class="text-dark mb-2">Make sure it's 8 characters or more.</p>
              <div class="w-full h-fit relative bg-lightblue border-b-2 border-dark mb-2 p-2">
                <label for="password" class="text-dark flex-2/3">Enter password</label>
                <div class="flex justify-between items-center pr-4">
                  <input v-model="password" id="password" name="password" class="w-full bg-lightblue text-lg flex-1"
                    :type="`${showPassword ? 'text' : 'password'}`">
                  <i :class="`${showPassword ? 'fa-solid fa-eye-slash text-dark flex-0 text-2xl' : 'fa-solid fa-eye text-dark flex-0 text-2xl'}`"
                    @click="togglePwdVisibility"></i>
                </div>
              </div>
              <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
                <label for="confirmPassword" class="text-dark">Please confirm passsword</label>
                <div class="flex justify-between items-center pr-4">

                  <input v-model="confirmPassword" id="confirmPassword" name="confirmPassword"
                    class="w-full bg-lightblue text-lg" :type="`${showPassword ? 'text' : 'password'}`">
                  <i :class="`${showPassword ? 'fa-solid fa-eye-slash text-dark flex-0 text-2xl' : 'fa-solid fa-eye text-dark flex-0 text-2xl'}`"
                    @click="togglePwdVisibility"></i>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="signUpStore.getStep === 'step4'">
          <div class="flex gap-4 justify-between p-4">
            <button @click.prevent="goTo('step3')"
              class="rounded-full bg-lightblue font-semibold text-blue px-8 py-4 border border-blue hover:bg-blue hover:text-white disabled:opacity-50 cursor-not-allowed">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="flex-2 flex justify-center">
              <i class="fab fa-twitter text-blue text-4xl"></i>
            </div>
          </div>
          <div class="flex flex-col gap-4 px-8">
            <p class="text-2xl font-semibold">Create your account</p>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="name" class="text-dark">Name</label>
              <input v-model="name" id="name" name="name" class="w-full bg-lightblue text-lg" type="text">
            </div>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="email" class="text-dark">Email</label>
              <input v-model="email" id="email" name="email" class="w-full bg-lightblue text-lg" type="text">
            </div>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="birthdate" class="text-dark">Date of birth</label>
              <input v-model="birthdate" id="birthdate" name="birthdate" class="w-full bg-lightblue text-lg"
                type="text">
              </input>
            </div>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="phone" class="text-dark">Phone number</label>
              <input v-model="phone" id="phone" name="phone" class="w-full bg-lightblue text-lg" type="text">
              </input>
            </div>
            <p>By signing up, you agree to our <a href="#" class="text-blue">Terms</a>, <a href="#"
                class="text-blue">Privacy Policy</a> and <a href="#" class="text-blue">Cookie Use</a>.</p>
            <div class="w-full flex justify-end">
              <button @click.prevent="handleSignUp"
                class="rounded-full px-8 py-4 bg-blue text-white font-semibold hover:bg-darkblue">Sign
                up</button>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="signUpStore.getStep === 'step5'">
          <div class="flex gap-4 justify-between p-4">
            <div class="flex-2 flex justify-center">
              <i class="fab fa-twitter text-blue text-4xl"></i>
            </div>
            <button @click.prevent="handleCompleteSignUp()"
              class="rounded-full bg-blue font-semibold text-white px-8 py-4 hover:bg-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!verificationCode">Next</button>
          </div>
          <div class="flex flex-col gap-4 px-8">
            <p class="text-2xl font-semibold">We sent you a code </p>
            <p class="text-dark mb-2">Enter it below to verify {{ email }}</p>
            <div class="w-full bg-lightblue border-b-2 border-dark mb-2 p-2">
              <label for="verificationCode" class="text-dark">Verification code</label>
              <input v-model="verificationCode" id="verificationCode" name="verificationCode"
                class="w-full bg-lightblue text-lg" type="text">
            </div>

            <button @click.prevent="resendVerificationCode" class="text-blue p-2 hover:underline">Didn't
              receive an email?</button>
            <p v-if="resendConfirmMsg.length > 0" class="text-dark mb-2"> {{ resendConfirmMsg }}</p>
          </div>
        </fieldset>
      </form>
    </section>
  </main>
</template>
