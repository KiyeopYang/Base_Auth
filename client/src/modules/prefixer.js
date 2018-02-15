import Prefixer from 'inline-style-prefixer'

const prefixer = new Prefixer();

export default function(o) {
  return prefixer.prefix(o);
}
