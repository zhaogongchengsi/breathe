import { describe, expect, it } from 'vitest'
import { RecordInfo } from '..'

describe('record', () => {
  it('add info', () => {
    const rec = new RecordInfo()

    rec.change('/index', 'add')

    expect(rec.values()).toEqual({
      '/index': {
        quantity: 1,
        type: 'add',
      },
    })
  })

  it('Multiple changes', () => {
    const rec = new RecordInfo()

    rec.change('/index', 'add')
    rec.change('/index', 'add')
    rec.change('/index', 'add')
    rec.change('/home', 'delete')

    expect(rec.values()).toEqual({
      '/index': {
        quantity: 3,
        type: 'add',
      },
      '/home': {
        quantity: 1,
        type: 'delete',
      },
    })
  })

  it('clear', () => {
    const rec = new RecordInfo()

    rec.change('/index', 'add')
    rec.change('/index', 'add')
    rec.change('/index', 'add')
    rec.change('/home', 'delete')
    rec.clear()
    expect(rec.values()).toEqual({})
  })

  it('toString', () => {
    const rec = new RecordInfo()
    rec.change('/index', 'add')
    rec.change('/index', 'update')
    rec.change('/home', 'delete')

    expect(rec.toString()).toMatchInlineSnapshot(`
      "/index file change x2
      Delete /home file"
    `)
  })

  it('isChange', () => {
    const rec = new RecordInfo()
    const rec2 = new RecordInfo()
    rec.change('/index', 'add')
    expect(rec.isChange).toBe(true)
    expect(rec2.isChange).toBe(false)
  })
})
