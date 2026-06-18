<script setup lang="ts">
import LanguageSwitcher from "~/components/LanguageSwitcher.vue"
import PixelButton from "~/components/ui/PixelButton.vue"
import PixelCard from "~/components/ui/PixelCard.vue"
import PixelInput from "~/components/ui/PixelInput.vue"

const { t } = useI18n()
const auth = useAuthStore()
const email = ref("")
const password = ref("")
const error = ref<string | null>(null)
const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.login(email.value, password.value)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Login failed")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-pixel-sand p-4 md:p-8">
    <div class="w-full max-w-sm">
      <div class="mb-4 flex justify-end">
        <LanguageSwitcher />
      </div>

      <PixelCard>
        <div class="mb-8 text-center">
          <div class="mb-4 text-6xl leading-none">
            🐔
          </div>
          <h1 class="font-pixel text-base leading-loose text-pixel-black">
            {{ t("Chicken to Fight") }}
          </h1>
          <p class="mt-3 font-ui text-base text-pixel-brown">
            {{ t("Log in to your farm") }}
          </p>
        </div>

        <form
          class="flex flex-col gap-5"
          @submit.prevent="submit"
        >
          <PixelInput
            id="email"
            v-model="email"
            :label="'Email'"
            autocomplete="email"
            placeholder="coach@example.com"
            required
            type="email"
          />

          <PixelInput
            id="password"
            v-model="password"
            :label="t('Password')"
            :error="error ?? undefined"
            autocomplete="current-password"
            placeholder="••••••••"
            required
            type="password"
          />

          <PixelButton
            :disabled="loading"
            class="mt-1 w-full"
            type="submit"
          >
            {{ loading ? t("Logging in…") : t("Log in") }}
          </PixelButton>
        </form>

        <p class="mt-6 text-center font-ui text-sm text-pixel-gray">
          {{ t("No account yet?") }}
          <NuxtLinkLocale
            class="font-ui font-bold text-pixel-blue underline hover:text-pixel-blue-light"
            to="/register"
          >
            {{ t("Sign up") }}
          </NuxtLinkLocale>
        </p>
      </PixelCard>
    </div>
  </div>
</template>
