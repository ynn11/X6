#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const cp = require('child_process')
const os = require('os')

function compile(source, target) {
  let cmd = './node_modules/.bin/lessc'
  if (os.type() === 'Windows_NT') {
    const cwd = process.cwd()
    cmd = path.join(cwd, './node_modules/.bin/lessc.cmd')
  }
  cp.execFileSync(cmd, [source, target])
}

const cwd = process.cwd()
const es = path.join(cwd, 'es')
const lib = path.join(cwd, 'lib')
const src = path.join(cwd, 'src')
const dist = path.join(cwd, 'dist')

compile(path.join(src, 'index.less'), path.join(es, 'index.css'))
compile(path.join(src, 'index.less'), path.join(lib, 'index.css'))
compile(path.join(src, 'index.less'), path.join(dist, 'x6.css'))

function toCSSPath(source) {
  const dir = path.dirname(source)
  const file = path.basename(source, '.less') + '.css'
  return path.join(dir, file)
}

// Copy less files
function readdir(dir) {
  const stat = fs.statSync(dir)
  if (stat) {
    if (stat.isDirectory()) {
      fs.readdir(dir, (err, files) => {
        files.forEach((file) => {
          readdir(path.join(dir, file))
        })
      })
    } else {
      const ext = path.extname(dir)
      if (ext === '.less' || ext === '.css') {
        fse.copySync(dir, path.join(es, path.relative(src, dir)))
        fse.copySync(dir, path.join(lib, path.relative(src, dir)))
      }

      if (ext === '.less') {
        let source = path.join(es, path.relative(src, dir))
        let target = toCSSPath(source)
        compile(dir, target)

        source = path.join(lib, path.relative(src, dir))
        target = toCSSPath(source)
        compile(dir, target)
      }
    }
  }
}

function raw() {
  const source = path.join(dist, 'x6.css')
  const target = path.join(src, 'style/raw.ts')
  const content = fs.readFileSync(source, { encoding: 'utf8' })
  const old = fs.readFileSync(target, { encoding: 'utf8' })
  const curr = `/* tslint:disable */

/**
* Auto generated file, do not modify it!
*/
const content =
\`${content}\`

export { content }`

  if (old !== curr) {
    fs.writeFile(target, curr, () => {})
  }
}

// console.log('Copy style files to output directory\n')
readdir(src)
raw()
