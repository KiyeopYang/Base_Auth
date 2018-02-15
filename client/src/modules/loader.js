export default function(on) {
  const loader = document.getElementById('loader');
  if (on && !loader) {
    const d = document.createElement('div');
    d.id = 'loader';
    const l = document.createElement('span');
    l.className = 'loader';
    const l_i = document.createElement('span');
    l_i.className = 'loader-inner';
    l.appendChild(l_i);
    d.appendChild(l);
    document.body.insertBefore(
      d,
      document.body.firstChild);
  } else if (!on && loader) {
    document.body.removeChild(loader);
  }
}
