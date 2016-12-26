const pem = require('pem')

function createPrivateKey(options) {
  if (!options) options = {}
  options.keyBitsize = options.keyBitsize || '4096'
  options.ciphers = options.ciphers || 'aes256'

  return new Promise((res, rej) => {
    pem.createPrivateKey(options, (err, key) => {
      if (err) return rej(err)
      res(key)
    })
  })
}

function createCertificate(options) {
  if (!options) options = {}
  options.days = options.conexionSegura.days || 1
  options.selfSigned = options.conexionSegura.selfSigned || true
  options.country = options.conexionSegura.country || 'ES'
  options.state = options.conexionSegura.state || 'SC de Tenerife'
  options.locality = options.conexionSegura.locality || 'La Laguna'
  options.organization = options.conexionSegura.organization || 'rafadanipedro'
  options.commonName = options.conexionSegura.commonName || 'rafadanipedro'

  return new Promise((res, rej) => {
    pem.createCertificate(options, (err, keys) => {
      if (err) return rej(err)
      res(keys)
    })
  })
}

module.exports = (keyConfig, certConfig) => {
  return createPrivateKey(keyConfig).then(({key}) => {
    certConfig.serviceKey = key
    return createCertificate(certConfig)
  })
}
