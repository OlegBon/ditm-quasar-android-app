<template>
  <q-page padding>
    <q-tabs v-model="activeTab" class="login-tabs">
      <q-tab name="signIn" label="Sign In" />
      <q-tab name="signUp" label="Sign Up" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" class="login-panels">
      <q-tab-panel name="signIn">
        <h1>Sign In</h1>
        <div class="q-pa-md" style="max-width: 400px">
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

            <div>
              <q-btn label="Sign In" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </div>
      </q-tab-panel>

      <q-tab-panel name="signUp">
        <h1>Sign Up</h1>
        <div class="q-pa-md" style="max-width: 400px">
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

const activeTab = ref('signIn')
const formSubmitted = ref(false) // Додаємо змінну для перевірки сабміту

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

function onSignInSubmit() {
  // Виконуємо валідацію перед сабмітом
  signInForm.value.validate().then((isValid) => {
    if (isValid) {
      // Логіка сабміту форми Sign In
    } else {
      console.log('Validation failed')
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

function onSignUpSubmit() {
  formSubmitted.value = true // Встановлюємо флаг сабміту форми

  // Перевірка поля accept перед відправленням форми
  if (!signUpAccept.value) {
    return
  }

  // Виконуємо валідацію перед сабмітом
  signUpForm.value.validate().then((isValid) => {
    if (isValid) {
      formSubmitted.value = false // Скидаємо флаг сабміту форми після успішної валідації
      // Логіка сабміту форми Sign Up
    } else {
      console.log('Validation failed')
    }
  })
}

watch(signUpAccept, (newVal) => {
  if (newVal) {
    formSubmitted.value = false
  }
})

function onSignUpReset() {
  signUpEmail.value = ''
  signUpPassword.value = ''
  signUpRepeatPassword.value = ''
  signUpAccept.value = false
  showSignUpPassword.value = false
  showSignUpRepeatPassword.value = false
  formSubmitted.value = false // Скидаємо флаг сабміту форми
}
</script>
