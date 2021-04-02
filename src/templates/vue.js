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
    ? `<span class="y-c-icon" :class="{ext: ext}" :style="ext ? \`background-image: url(\${base64});\` : \`-webkit-mask-image:url(\${base64});background-color:\${color};\`"></span>`
    : `<svg
${attrs}
>
${svgCode}
</svg>`
}
</template>
<script>
  ${isBit ? `import './common.css'` : ''}
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
`

module.exports = { getAttrs, getStr }
