<template>
  <q-page padding class="q-mb-xl">
    <q-tabs v-model="activeTab" class="login-tabs">
      <q-tab name="signIn" :label="$t('content.login.tabSignIn')" />
      <q-tab name="signUp" :label="$t('content.login.tabSignUp')" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" class="login-panels">
      <q-tab-panel name="signIn">
        <h1>{{ $t('content.login.headingSignIn') }}</h1>
        <div class="q-pa-md block-center" style="max-width: 400px">
          <q-form @submit.prevent="onSignInSubmit" @reset="onSignInReset" class="q-gutter-md">
            <q-input
              filled
              type="email"
              v-model="signInEmail"
              :label="$t('content.login.email')"
              lazy-rules
              :error="!!emailErrorSignIn"
              :error-message="emailErrorSignIn"
            />
            <q-input
              filled
              :type="showSignInPassword ? 'text' : 'password'"
              v-model="signInPassword"
              :label="$t('content.login.password')"
              lazy-rules
              :error="!!passwordErrorSignIn"
              :error-message="passwordErrorSignIn"
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
              <q-btn :label="$t('content.login.btnSignIn')" type="submit" color="primary" />
              <q-btn
                :label="$t('content.login.btnReset')"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>

          <div v-if="errorMessageSignIn" class="error-box q-mt-md bigger-alert">
            {{ errorMessageSignIn }}
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="signUp">
        <h1>{{ $t('content.login.headingSignUp') }}</h1>
        <div class="q-pa-md block-center" style="max-width: 400px">
          <q-form @submit.prevent="onSignUpSubmit" @reset="onSignUpReset" class="q-gutter-md">
            <q-input
              filled
              type="text"
              v-model="signUpName"
              :label="$t('content.login.name')"
              lazy-rules
              :error="!!nameErrorSignUp"
              :error-message="nameErrorSignUp"
            />
            <q-input
              filled
              type="email"
              v-model="signUpEmail"
              :label="$t('content.login.email')"
              lazy-rules
              :error="!!emailErrorSignUp"
              :error-message="emailErrorSignUp"
            />
            <q-input
              filled
              :type="showSignUpPassword ? 'text' : 'password'"
              v-model="signUpPassword"
              :label="$t('content.login.password')"
              lazy-rules
              :error="!!passwordErrorSignUp"
              :error-message="passwordErrorSignUp"
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
              :label="$t('content.login.repeatPassword')"
              lazy-rules
              :error="!!repeatPasswordErrorSignUp"
              :error-message="repeatPasswordErrorSignUp"
              bottom-slots
            >
              <template v-slot:append>
                <q-icon
                  :name="showSignUpRepeatPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleShowSignUpRepeatPassword"
                />
              </template>
            </q-input>
            <!-- <q-toggle v-model="signUpAccept" label="I accept the license and terms" />
            <div v-if="formSubmitted && !signUpAccept.value" class="text-negative">
              You must accept the license and terms
            </div> -->
            <div v-if="userExists" class="text-negative">User already exists</div>
            <div>
              <q-btn :label="$t('content.login.btnSignUp')" type="submit" color="primary" />
              <q-btn
                :label="$t('content.login.btnReset')"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
          <div v-if="errorMessagesSignUp.length" class="error-box q-mt-md bigger-alert">
            <ul>
              <li v-for="(msg, i) in errorMessagesSignUp" :key="i">{{ msg }}</li>
            </ul>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
// import { ref, watch } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const activeTab = ref('signIn')
const formSubmitted = ref(false)
const loginError = ref(false)
const userExists = ref(false)

// Змінні для форми Sign In
const showSignInPassword = ref(false)

// Змінні для форми Sign Up
// const signUpAccept = ref(false)
const showSignUpPassword = ref(false)
const showSignUpRepeatPassword = ref(false)

/*
 *    Для форми Sign In
 */

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

// Роутер для переходу на інші сторінки
const router = useRouter()

// Визначаємо схему Yup
const signInSchema = yup.object({
  signInEmail: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    // Забороняємо пробіли
    .test('no-spaces', 'Email cannot contain spaces', (value) => {
      if (!value) return false
      // Перевіряємо, що немає пробілів
      return !/\s/.test(value)
    })
    // Требуемо крапку після @
    .test('has-dot-in-domain', 'Email domain must contain a dot', (value) => {
      if (!value) return false
      const domainPart = value.split('@')[1]
      // Якщо немає доменної частини (немає '@' або рядок порожній)
      if (!domainPart) return false
      // Перевіряємо, чи є крапка в доменній частині
      return domainPart.includes('.')
    }),
  signInPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('no-spaces', 'Password cannot contain spaces', (value) => {
      if (!value) return false
      return !/\s/.test(value)
    }),
})

// Ініціалізуємо useForm із цією схемою
const { handleSubmit: handleSubmitSignIn } = useForm({
  validationSchema: signInSchema,
})

// Прив'язуємо поля
const { value: signInEmail, errorMessage: emailErrorSignIn } = useField('signInEmail')
const { value: signInPassword, errorMessage: passwordErrorSignIn } = useField('signInPassword')

// Змінна для помилок з бекенда для Sign In
const errorMessageSignIn = ref('')

async function onSubmitSignIn(values) {
  errorMessageSignIn.value = ''

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: values.signInEmail,
      password: values.signInPassword,
    })
    console.log('Login success:', response.data)

    // Якщо сервер повернув токен
    if (response.data.token) {
      localStorage.setItem('api_token', response.data.token)
    }

    // Переходимо на /user
    router.push('/user')
  } catch (error) {
    console.error('Login error:', error.response?.data || error)

    if (error.response?.status === 422 || error.response?.status === 401) {
      errorMessageSignIn.value = 'Invalid credentials. Please check your Email/Password.'
    } else {
      errorMessageSignIn.value = 'Something went wrong. Please try again.'
    }
  }
}

// Оскільки використовуємо <q-form>, потрібно вручну викликати handleSubmitSignIn(onSubmitSignIn)
function onSignInSubmit() {
  handleSubmitSignIn(onSubmitSignIn)()
}

function onSignInReset() {
  signInEmail.value = ''
  signInPassword.value = ''
  showSignInPassword.value = false
}

/*
 *    End Для форми Sign In
 */

/*
 *    Для форми Sign Up
 */

// Визначаємо схему Yup
const signUpSchema = yup.object({
  signUpName: yup
    .string()
    .required('Name is required')
    .max(255, 'Name must be at most 255 characters')
    .test(
      'not-only-spaces',
      'Name cannot be only spaces',
      (value) => !!value && value.trim().length > 0,
    )
    .test('not-only-digits', 'Name cannot be only digits', (value) => {
      if (!value) return false
      // Перевіряємо, чи не складається рядок тільки з цифр
      return !/^\d+$/.test(value.trim())
    }),

  signUpEmail: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    // Забороняємо пробіли
    .test('no-spaces', 'Email cannot contain spaces', (value) => {
      if (!value) return false
      // Перевіряємо, що немає пробілів
      return !/\s/.test(value)
    })
    // Требуемо крапку після @
    .test('has-dot-in-domain', 'Email domain must contain a dot', (value) => {
      if (!value) return false
      const domainPart = value.split('@')[1]
      // Якщо немає доменної частини (немає '@' або рядок порожній)
      if (!domainPart) return false
      // Перевіряємо, чи є крапка в доменній частині
      return domainPart.includes('.')
    }),

  signUpPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('no-spaces', 'Password cannot contain spaces', (value) => {
      if (!value) return false
      // Забороняємо будь-які пробіли (пробіл, табуляція, переведення рядка тощо)
      return !/\s/.test(value)
    }),

  signUpRepeatPassword: yup
    .string()
    .oneOf([yup.ref('signUpPassword')], 'Passwords must match')
    .required('Please confirm your password'),
})

// Ініціалізуємо useForm, прив'язуємо схему
const { handleSubmit: handleSubmitSignUp } = useForm({
  validationSchema: signUpSchema,
})

// Прив'язуємо поля
const { value: signUpName, errorMessage: nameErrorSignUp } = useField('signUpName')
const { value: signUpEmail, errorMessage: emailErrorSignUp } = useField('signUpEmail')
const { value: signUpPassword, errorMessage: passwordErrorSignUp } = useField('signUpPassword')
const { value: signUpRepeatPassword, errorMessage: repeatPasswordErrorSignUp } =
  useField('signUpRepeatPassword')

// Змінна для помилок з бекенда для Sign Up
const errorMessagesSignUp = ref([])

async function onSubmitSignUp(values) {
  errorMessagesSignUp.value = []

  try {
    // Надсилаємо запит на сервер
    const response = await axios.post('http://127.0.0.1:8000/api/register', {
      name: values.signUpName,
      email: values.signUpEmail,
      password: values.signUpPassword,
      password_confirmation: values.signUpRepeatPassword,
    })

    console.log('Registration success:', response.data)
    if (response.data.token) {
      localStorage.setItem('api_token', response.data.token)
    }

    // Переходимо на /user
    router.push('/user')
  } catch (error) {
    console.error('Registration error:', error.response?.data || error)
    // Обробляємо помилки з бекенда (Laravel)
    if (error.response?.status === 422) {
      const allErrors = error.response.data.errors || {}
      let combined = []
      for (const field in allErrors) {
        combined = combined.concat(allErrors[field])
      }
      errorMessagesSignUp.value = combined
    } else if (error.response?.status === 401) {
      errorMessagesSignUp.value = ['You are not authorized to register.']
    } else {
      errorMessagesSignUp.value = ['Something went wrong. Please try again.']
    }
  }
}

// Оскільки використовуємо <q-form>, потрібно вручну викликати handleSubmitSignUp(onSubmitSignUp)
function onSignUpSubmit() {
  handleSubmitSignUp(onSubmitSignUp)()
}

// watch(signUpAccept, (newVal) => {
//   if (newVal) {
//     userExists.value = false
//   }
// })

function onSignUpReset() {
  signUpName.value = ''
  signUpEmail.value = ''
  signUpPassword.value = ''
  signUpRepeatPassword.value = ''
  // signUpAccept.value = false
  showSignUpPassword.value = false
  showSignUpRepeatPassword.value = false
  formSubmitted.value = false
  userExists.value = false
}

/*
 *    End Для форми Sign Up
 */
</script>
