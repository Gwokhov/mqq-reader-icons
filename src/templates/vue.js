const getAttrs = style => {
  const baseAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    ':width': 'size',
    ':height': 'size',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    'v-on': '$listeners'
  }
  const fillAttrs = {
    ':fill': 'color'
  }
  // const strokeAttrs = {
  //   ':stroke': 'color',
  //   ':fill': 'color'
  // }
  return Object.assign({}, baseAttrs, fillAttrs)
}

const getStr = (iconName, attrs, svgCode, isBit = false) =>
  `<template>
${
  isBit
    ? `<span :class="{ext: ext}" :style="ext ? \`background: center / 100% no-repeat url(\${base64});\` : \`-webkit-mask-image:url(\${base64});background-color:\${color};-webkit-mask-position: center center;-webkit-mask-repeat: no-repeat;-webkit-mask-size: 100%;\` + \`width:\${size};height:\${size};\`"></span>`
    : `<svg
${attrs}
>
${svgCode}
</svg>`
}
</template>
<script>
  export default {
    name: 'Icon-${iconName}',
    props: {
      size: {
        type: [Number, String],
        default: 24
      },
      color: {
        type: String,
        default: 'currentColor'
      },
      ${
        isBit
          ? `ext: {
        type: Boolean,
        default: false
      },
      `
          : ''
      }
    },
    ${
      isBit
        ? `data() {
      return { 
        base64: '${svgCode}'
      }
    }` : ''}
  }
</script>
<style lang="scss">
span {
  vertical-align: text-bottom;
  display: inline-block;
}
`

module.exports = { getAttrs, getStr }
