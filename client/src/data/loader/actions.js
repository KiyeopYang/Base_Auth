export const ON = 'data/loader/ON';
export const OFF = 'data/loader/OFF';
const on = () => {
  return {
    type: ON,
  };
};
const off = () => {
  return {
    type: OFF,
  };
};
export default state => state ? on() : off();
