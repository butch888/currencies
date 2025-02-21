export const isOnlyLetters = (str) => {
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
  return regex.test(str);
}