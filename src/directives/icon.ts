export default {
  beforeMount(el: HTMLElement, binding: any) {
    const iconClass = `fa fa-${binding.value} float-right text-green-400 text-xl`
    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
