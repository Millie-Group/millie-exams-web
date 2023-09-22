<template>
  <Portal to="popup">
    <transition name="popup-fade">

      <div v-if="open" class="popup" @click.self="$emit('update:open', false)">
        <slot @click.stop />
      </div>

    </transition>
  </Portal>
</template>

<script>
export default {
  props: {
    open: {
      default: false,
      type: null
    }
  }
}
</script>

<style lang="scss">
$bezier: cubic-bezier(0.18, 0.89, 0.35, 1.45);

.popup-fade-enter-active {
  opacity: 1;
  backdrop-filter: blur(6px);
  transition: all .2s ease;

  & > * {
    transition: transform .2s $bezier; //cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scale(1) translateY(0);
  }
}

.popup-fade-enter, .popup-fade-leave-active {
  opacity: 0;
  backdrop-filter: blur(0px);
  transition: all .2s ease;

  & > * {
    transform: scale(.95) translateY(20px);
  }
}

.popup > * {
  transition: transform .2s $bezier;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(1, 1, 1, .2);
  backdrop-filter: blur(6px);
  overflow: auto;
  z-index: 99999999999999;
}
</style>
