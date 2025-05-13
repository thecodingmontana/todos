<script setup lang="ts">
import {
  LogOut,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

withDefaults(defineProps<{
  side?: 'right' | 'top' | 'bottom' | 'left'
}>(), {
  side: 'bottom',
})

const { clear: clearSession, user } = useUserSession()

const isSigninOut = ref(false)

async function onSignOut() {
  try {
    isSigninOut.value = true
    await clearSession()

    return navigateTo('/')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    const errorMessage = error.response
      ? error.response._data.message
      : error.message

    toast.error(errorMessage, {
      position: 'top-center',
    })
  }
  finally {
    isSigninOut.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="mx-3">
      <Avatar>
        <AvatarImage
          :src="user?.avatar ?? ''"
          :alt="user?.username"
        />
        <AvatarFallback class="rounded-lg">
          CN
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-[#1d1d1d]"
      :side="side"
      :align="side ==='top' ? 'start' : 'end'"
    >
      <DropdownMenuLabel class="p-0 font-normal ">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar>
            <AvatarImage
              :src="user?.avatar ?? ''"
              :alt="user?.username"
            />
            <AvatarFallback class="rounded-lg">
              CN
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ user?.username }}</span>
            <span class="truncate text-xs">{{ user?.email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="cursor-pointer dark:hover:bg-[#343434]"
        :disabled="isSigninOut"
        @click="onSignOut"
      >
        <LogOut />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
