const {
  ensureDir,
  writeFile,
  readdir,
  readFileSync,
  copy,
  copyFile
} = require('fs-extra')
const { join, resolve } = require('path')
const SVGO = require('svgo')
const cheerio = require('cheerio')
const imageToBase64 = require('image-to-base64')
const changeCase = require('change-case')
const { svgoOptions } = require('./config')
const vueTool = require('./templates/vue')
const cssTool = require('./templates/css')

let cssContent = ''
let vueExportContent = ''

const svgo = new SVGO(svgoOptions)

const encodeSvg = str =>
  'data:image/svg+xml,' +
  str
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')

const removeSVGTag = svg => cheerio.load(svg)('body').children().html()

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

const genFromPNG = (filePath, filename) => {
  console.log(`genFromPNG: ${filePath}`)
  const regRes = /(.+?).png/g.exec(filename)
  return imageToBase64(filePath)
    .then(encodeStr => {
      encodeStr = 'data:image/png;base64,' + encodeStr
      const iconName = changeCase.paramCase(regRes[1]).trim()
      cssContent += cssTool.getStr(iconName, encodeStr)
      vueExportContent += `export { default as Icon${changeCase.pascalCase(
        iconName
      )} } from './vue/${changeCase.pascalCase(iconName)}.vue';\n`
      const vueComponentStr = vueTool.getStr(
        changeCase.headerCase(iconName),
        attrsToString(vueTool.getAttrs('fill'), 'fill'),
        encodeStr,
        true
      )
      writeFile(
        resolve(
          __dirname,
          '..',
          'dist/vue',
          `${changeCase.pascalCase(iconName)}.vue`
        ),
        vueComponentStr
      )
    })
    .catch(err => {
      console.error(filePath, filename, err)
    })
}

const genFromSVG = (filePath, filename) => {
  console.log(`genFromSVG: ${filePath}`)
  const regRes = /(.+?).svg/g.exec(filename)
  const data = readFileSync(filePath, 'utf8')
  return svgo.optimize(data).then(res => {
    const svg = removeSVGTag(res.data)
    const iconName = regRes[1].trim()

    cssContent += `  --i-${changeCase.paramCase(iconName)}: url("${encodeSvg(
      res.data
    )}");\n`
    vueExportContent += `export { default as Icon${changeCase.pascalCase(
      iconName
    )} } from './vue/${changeCase.pascalCase(iconName)}.vue';\n`
    const vueComponentStr = vueTool.getStr(
      changeCase.headerCase(iconName),
      attrsToString(vueTool.getAttrs('fill'), 'fill'),
      svg
    )
    writeFile(
      resolve(
        __dirname,
        '..',
        'dist/vue',
        `${changeCase.pascalCase(iconName)}.vue`
      ),
      vueComponentStr
    )
    writeFile(
      resolve(__dirname, '..', 'dist/compressed/svg', filename),
      res.data
    )
  })
}

const handleOriginSVG = () => {
  const originPath = join(__dirname, '..', 'dist/svg')
  const compressPath = join(__dirname, '..', 'dist/compressed/svg')
  const vueComponentPath = join(__dirname, '..', 'dist/vue')

  return readdir(originPath)
    .then(files => {
      return Promise.all([
        ensureDir(compressPath),
        ensureDir(vueComponentPath)
      ]).then(() => {
        const dataUrlPromises = files.map(filename => {
          const filePath = join(originPath, filename)
          return genFromSVG(filePath, filename)
        })
        return Promise.all(dataUrlPromises)
      })
    })
    .catch(err => {
      throw err
    })
}

const handleOriginPNG = () => {
  const originPath = join(__dirname, '..', 'dist/png')
  const vueComponentPath = join(__dirname, '..', 'dist/vue')

  return readdir(originPath)
    .then(files => {
      return ensureDir(vueComponentPath).then(() => {
        const base64Promises = files.map(filename => {
          const filePath = join(originPath, filename)
          if (filename.indexOf('nav-') !== 0) {
            return genFromPNG(filePath, filename)
          } else {
            return copy(
              filePath,
              join(__dirname, '..', 'dist/png/nav', filename)
            )
          }
        })
        return Promise.all(base64Promises)
      })
    })
    .catch(err => {
      console.error(err)
    })
}

Promise.all([handleOriginSVG(), handleOriginPNG()])
  .then(() => {
    writeFile(
      join(__dirname, '..', 'dist', 'icons.css'),
      `:root {\n${cssContent}}`
    )
    writeFile(join(__dirname, '..', 'dist', 'index.js'), vueExportContent)
    writeFile(join(__dirname, '..', 'dist', 'index.d.ts'), vueExportContent)
  })
  .catch(err => {
    console.error(err)
  })
