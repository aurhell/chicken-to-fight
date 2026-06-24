<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"

import { useAuthStore } from "~/application/auth/useAuthStore"
import LanguageSwitcher from "~/presentation/components/LanguageSwitcher.vue"
import GameTitle from "~/presentation/components/game/GameTitle.vue"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"
import PixelInput from "~/presentation/components/ui/PixelInput.vue"

const { t } = useI18n()
const auth = useAuthStore()
const username = ref("")
const email = ref("")
const password = ref("")
const error = ref<string | null>(null)
const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.register(username.value, email.value, password.value)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Registration failed")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-pixel-sand p-4 md:p-8">
    <div class="w-full max-w-md">
      <div class="mb-4 flex justify-end">
        <LanguageSwitcher />
      </div>

      <PixelCard>
        <div class="mb-8 text-center">
          <img
            src="~/assets/images/CTF-revival-logo.png"
            alt="Chicken to Fight"
            class="mx-auto mb-4 h-32 w-auto"
          >
          <GameTitle />
          <h2 class="mt-4 font-pixel text-[12px] leading-loose text-pixel-black">
            {{ t("Join the arena") }}
          </h2>
          <p class="mt-3 font-ui text-base text-pixel-brown">
            {{ t("Create your coach account") }}
          </p>
        </div>

        <form
          class="flex flex-col gap-5"
          @submit.prevent="submit"
        >
          <PixelInput
            id="username"
            v-model="username"
            :label="t('Coach name')"
            autocomplete="username"
            placeholder="GrandCoach42"
            required
            type="text"
          />

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
            :placeholder="t('8 characters minimum')"
            autocomplete="new-password"
            minlength="8"
            required
            type="password"
          />

          <PixelButton
            :disabled="loading"
            class="mt-1 w-full"
            type="submit"
          >
            {{ loading ? t("Creating…") : t("Create my account") }}
          </PixelButton>
        </form>

        <p class="mt-6 text-center font-ui text-base text-pixel-gray">
          {{ t("Already have an account?") }}
          <NuxtLinkLocale
            class="font-ui font-bold text-pixel-blue underline hover:text-pixel-blue-light"
            to="/login"
          >
            {{ t("Log in") }}
          </NuxtLinkLocale>
        </p>
      </PixelCard>
    </div>
  </div>
</template>
