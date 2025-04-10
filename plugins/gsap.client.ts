import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Draggable } from 'gsap/Draggable'
import { TextPlugin } from 'gsap/TextPlugin'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable, TextPlugin)
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
      ScrollToPlugin,
      TextPlugin,
    },
  }
})
