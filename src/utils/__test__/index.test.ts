import { join } from 'path'
import { describe, expect, it } from 'vitest'
import { requestType } from '..'
import { catalogScan, createFileChtch, fileExist } from '../fs'
import { _require } from '../module'

describe('fs', () => {
  it('fileExist', () => {
    const is1 = fileExist(join(__dirname, 'test.json'))
    const is2 = fileExist(join(__dirname, 'test1'))

    expect(is1).toBe(true)
    expect(is2).toBe(false)
  })

  it('catalogScan', async () => {
    const cacth = await catalogScan(__dirname, 'pages')
    const index = cacth.get('pages/index')
    const index2 = cacth.get('pages/about/index')
    const index3 = cacth.get('pages/about/desc/index')

    expect(index).toContain('<h1>pages</h1>')
    expect(index2).toContain('<h1>about page</h1>')
    expect(index3).toContain('<h1>about desc</h1>')
  })

  it('catalogScan (sep)', async () => {
    const cacth = await catalogScan(__dirname, 'pages', undefined, '|')
    const index = cacth.get('pages|index')
    expect(index).toContain('<h1>pages</h1>')
  })
})

describe('createFileChtch', async () => {
  const cacth = await createFileChtch(__dirname, 'pages')

  it('find', () => {
    const file = cacth.find('/index.html')
    expect(file).toContain('<h1>pages</h1>')

    const file2 = cacth.find('/index')
    expect(file2).toContain('<h1>pages</h1>')
  })

  it('update', async () => {
    const file = cacth.find('/index.html')
    await cacth.update('/index.html')
    expect(file).toContain('<h1>pages</h1>')
  })

  it('update value', async () => {
    await cacth.update('/index.html', '<h1> 123 </h1>')
    expect(cacth.find('/index.html')).toContain('<h1> 123 </h1>')
  })

  it('add value', async () => {
    await cacth.update('/index2.html', '<h1> 123 </h1>')
    expect(cacth.find('/index2.html')).toContain('<h1> 123 </h1>')
  })

  it('delete', async () => {
    cacth.deleteChtch('/index.html')
    const value = cacth.find('/index.html')
    expect(value).toBe(undefined)
  })
})

describe('module', () => {
  it('_require', async () => {
    const json = await _require(join(__dirname, 'test.json'))
    expect(json.name).toBe('zhaogongchengsi')
  })
})

describe('request', () => {
  it('requestType', () => {
    const type1 = requestType('/')
    const type2 = requestType('/index')
    const type3 = requestType('/index.scss')
    const type4 = requestType('/index.png')
    const type5 = requestType('/index.html')
    expect(type1).toBe('html')
    expect(type2).toBe('html')
    expect(type5).toBe('html')
    expect(type3).toBe('style')
    expect(type4).toBe('resources')
  })
})
