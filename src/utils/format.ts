export function formatErr(err: any) {
  const msg = []

  for (const key in err) {
    if (Object.prototype.hasOwnProperty.call(err, key)) {
      const str = err[key]
      msg.push(`${key}: ${str.toString()}`)
    }
  }

  return msg.join('\n')
}
