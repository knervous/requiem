const arr = [
    ['uint32', 'material'],
    ['uint32', 'unk1'],
    ['uint32', 'elite_material'],
    ['uint8', 'blue'],
    ['uint8', 'green'],
    ['uint8', 'red'],
    ['uint8', 'use_tint']
]

const getCtor = (entry) => {
    const [type, key] = entry
    let ret = `${Array.isArray(key) ? key[0] : key}: `
    let jsType = 'number'
    switch (type) {
      case 'int8':
      case 'uint8':
      case 'int16':
      case 'uint16':
      case 'int32':
      case 'uint32':
        jsType = 'number';
        break;
      case 'bool':
        jsType = 'bool';
        break
      case 'float':
        jsType = 'number';
        break
      case 'char':
        jsType = 'string';
        break
      case 'buffer':
        return null;
      case 'fixed_char': {
        jsType = 'string';
        break
      }
      case 'fixed_chars': {
        const [, length] = key
        jsType=`[${Array.from(new Array(length)).map((v,i) => `arg${i}: string`).join(', ')}]`
        break
      }
      case 'struct': {
        const [, Struct] = key
        jsType = Struct;
        break
      }
      case 'fixed_array': {
        const [, Struct, length] = key
        jsType=`[${Array.from(new Array(length)).map((v,i) => `arg${i}: ${Struct}`).join(', ')}]`
        break
      }
    }

    return `${ret}${jsType}`
}

const ctor = `
/**
 * @param { [${arr.map(getCtor).join(', ')}] | [data: ArrayBuffer]} args
 */
`

console.log('output')
console.log(ctor)