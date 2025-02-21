export const selectCurrency = (field, CharCode, Name, setState) => {
  setState(prev => ({
    ...prev,
    [field]: {name: CharCode + ' ' + Name, data: prev[field].data} 
  }));
}