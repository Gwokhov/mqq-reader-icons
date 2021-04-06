const commonAttrs = {
  'aria-hidden': 'true',
  'v-on': '$listeners'
}
const svgAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  ':width': 'size',
  ':height': 'size',
  viewBox: '0 0 24 24',
  ':fill': 'color'
}
const bitAttrs = {
  ':style':
    '(ext ? `background:center / 100% no-repeat url(${base64});` : `-webkit-mask-image:url(${base64});background-color:${color};-webkit-mask-position: center center;-webkit-mask-repeat: no-repeat;-webkit-mask-size: 100%;`) + `width:${size};height:${size};vertical-align:text-bottom;display:inline-block;`'
}
const attrsToString = (attrs, style) => {
  return Object.keys(attrs)
    .map(key => {
      // should distinguish fill or stroke
      if (key === 'width' || key === 'height' || key === style) {
        return key + '={' + attrs[key] + '}'
      }
      return key + '="' + attrs[key] + '"'
    })
    .join(' ')
}
// const strokeAttrs = {
//   ':stroke': 'color',
//   ':fill': 'color'
// }
const getStr = (iconName, isBit, content) =>
  `<template>
${
  isBit
    ? `<span ${attrsToString({...commonAttrs, ...bitAttrs})}></span>`
    : `<svg ${attrsToString({...commonAttrs, ...svgAttrs})}>${content}</svg>`
}
</template>
<script>
  export default {
    name: 'Icon-${iconName}',
    props: {
      size: {
        type: [Number, String],
        default: '24px'
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
        base64: '${content}'
      }
    }`
        : ''
    }
  }
</script>
`

module.exports = { getStr }
