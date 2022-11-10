import { describe, expect, it } from 'vitest'
import { DEFAULT_HOST, DEFAULT_PORT, resolveConfig } from '../config'

describe('config', () => {
  it('resolveConfig', async () => {
    const conf = await resolveConfig(__dirname, 'config.json')

    expect(conf).toEqual({
      server: {
        port: 3030,
        host: '0.0.0.0',
      },
      build: {
        outdir: './_dist',
      },
      lib: './lib',
      pages: './pages',
      layouts: './layouts',
      staticDir: './public123',
      components: './components',
    })
  })

  it('resolveConfig (The specified configuration file does not exist)', async () => {
    const conf = await resolveConfig(__dirname, '')

    expect(conf).toEqual({
      server: {
        port: DEFAULT_PORT,
        host: DEFAULT_HOST,
      },
      build: {
        outdir: 'dist',
      },
      lib: 'lib',
      pages: 'pages',
      layouts: 'layouts',
      staticDir: 'public',
      components: 'components',
    })
  })
})
