<template>
  <q-page padding>
    <q-tabs v-model="activeTab" class="login-tabs">
      <q-tab name="signIn" label="Sign In" />
      <q-tab name="signUp" label="Sign Up" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" class="login-panels">
      <q-tab-panel name="signIn">
        <h1>Sign In</h1>
        <div class="q-pa-md block-center" style="max-width: 400px">
          <q-form
            ref="signInForm"
            @submit.prevent="onSignInSubmit"
            @reset="onSignInReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              type="email"
              v-model="signInEmail"
              label="Email *"
              lazy-rules
              :rules="emailRules"
            />
            <q-input
              filled
              :type="showSignInPassword ? 'text' : 'password'"
              v-model="signInPassword"
              label="Password *"
              lazy-rules
              :rules="passwordRules"
              bottom-slots
            >
              <template v-slot:append>
                <q-icon
                  :name="showSignInPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleShowSignInPassword"
                />
              </template>
            </q-input>
            <div v-if="loginError" class="text-negative">Invalid email or password</div>
            <div>
              <q-btn label="Sign In" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </div>
      </q-tab-panel>

      <q-tab-panel name="signUp">
        <h1>Sign Up</h1>
        <div class="q-pa-md block-center" style="max-width: 400px">
          <q-form
            ref="signUpForm"
            @submit.prevent="onSignUpSubmit"
            @reset="onSignUpReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              type="email"
              v-model="signUpEmail"
              label="Email *"
              lazy-rules
              :rules="emailRules"
            />
            <q-input
              filled
              :type="showSignUpPassword ? 'text' : 'password'"
              v-model="signUpPassword"
              label="Password *"
              lazy-rules
              :rules="passwordRules"
              bottom-slots
            >
              <template v-slot:append>
                <q-icon
                  :name="showSignUpPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleShowSignUpPassword"
                />
              </template>
            </q-input>
            <q-input
              filled
              :type="showSignUpRepeatPassword ? 'text' : 'password'"
              v-model="signUpRepeatPassword"
              label="Repeat password *"
              lazy-rules
              :rules="repeatPasswordRules"
              bottom-slots
            >
              <template v-slot:append>
                <q-icon
                  :name="showSignUpRepeatPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleShowSignUpRepeatPassword"
                />
              </template>
            </q-input>
            <q-toggle v-model="signUpAccept" label="I accept the license and terms" />
            <div v-if="formSubmitted && !signUpAccept.value" class="text-negative">
              You must accept the license and terms
            </div>
            <div v-if="userExists" class="text-negative">User already exists</div>
            <div>
              <q-btn label="Sign Up" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'
import axios from 'axios'

const userStore = useUserStore()
const activeTab = ref('signIn')
const formSubmitted = ref(false)
const loginError = ref(false)
const userExists = ref(false)

// Змінні для форми Sign In
const signInEmail = ref('')
const signInPassword = ref('')
const showSignInPassword = ref(false)

// Змінні для форми Sign Up
const signUpEmail = ref('')
const signUpPassword = ref('')
const signUpRepeatPassword = ref('')
const signUpAccept = ref(false)
const showSignUpPassword = ref(false)
const showSignUpRepeatPassword = ref(false)

// Правила валідації
const emailRules = [
  (val) => !!val || 'Please type your email',
  (val) => /^\S+@\S+\.\S+$/.test(val) || 'Please type a valid email',
]

const passwordRules = [
  (val) => !!val || 'Please type your password',
  (val) => val.length >= 8 || 'Password must be at least 8 characters long',
]

const repeatPasswordRules = [
  (val) => !!val || 'Please repeat your password',
  (val) => val === signUpPassword.value || 'Passwords must match',
]

// Функції для відображення/приховування пароля
function toggleShowSignInPassword() {
  showSignInPassword.value = !showSignInPassword.value
}

function toggleShowSignUpPassword() {
  showSignUpPassword.value = !showSignUpPassword.value
}

function toggleShowSignUpRepeatPassword() {
  showSignUpRepeatPassword.value = !showSignUpRepeatPassword.value
}

// Функції сабміту та скидання для форми Sign In
const signInForm = ref(null)
const router = useRouter()

async function onSignInSubmit() {
  signInForm.value.validate().then(async (isValid) => {
    if (isValid) {
      const { data } = await axios.get('https://dummyjson.com/users')
      const user = data.users.find(
        (user) => user.email === signInEmail.value && user.password === signInPassword.value,
      )
      if (user) {
        loginError.value = false
        const userDetail = await axios.get(`https://dummyjson.com/users/${user.id}`)
        userStore.login(userDetail.data)
        router.push('/user')
      } else {
        loginError.value = true
      }
    }
  })
}

function onSignInReset() {
  signInEmail.value = ''
  signInPassword.value = ''
  showSignInPassword.value = false
}

// Функції сабміту та скидання для форми Sign Up
const signUpForm = ref(null)

async function onSignUpSubmit() {
  formSubmitted.value = true
  userExists.value = false

  if (!signUpAccept.value) {
    return
  }

  signUpForm.value.validate().then(async (isValid) => {
    if (isValid) {
      const { data } = await axios.get('https://dummyjson.com/users')
      const existingUser = data.users.find((user) => user.email === signUpEmail.value)

      if (existingUser) {
        userExists.value = true
      } else {
        userExists.value = false
        const newUser = {
          email: signUpEmail.value,
          password: signUpPassword.value,
        }
        userStore.login(newUser)
        router.push('/user')
      }

      formSubmitted.value = false
    }
  })
}

watch(signUpAccept, (newVal) => {
  if (newVal) {
    userExists.value = false
  }
})

function onSignUpReset() {
  signUpEmail.value = ''
  signUpPassword.value = ''
  signUpRepeatPassword.value = ''
  signUpAccept.value = false
  showSignUpPassword.value = false
  showSignUpRepeatPassword.value = false
  formSubmitted.value = false
  userExists.value = false
}
</script>
