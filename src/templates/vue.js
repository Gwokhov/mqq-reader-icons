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

const getStr = (iconName, attrs, svgCode) =>
`<template>
<svg
  ${attrs}
>
  ${svgCode}
</svg>
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
      }
    }
  }
</script>
`

module.exports = { getAttrs, getStr }
