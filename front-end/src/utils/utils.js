// Remove emoji from the string
export function getRidOfEmoji(name) {
  return name.split(' ').slice(1).join(' ');
}
// change mealtype string to list words
export function changeToList(string) {
  return string.split(' ');
}
// curr time check function
export const curMealType = () => {
  const cur_hour = new Date().getHours();
  if (cur_hour < 10 && cur_hour >= 6) {
    return ['breakfast'];
  } else if (cur_hour < 12 && cur_hour >= 10) {
    return ['tea', 'snack', 'dessert'];
  } else if (cur_hour < 14 && cur_hour >= 12) {
    return ['lunch'];
  } else if (cur_hour < 17 && cur_hour >= 14) {
    return ['tea', 'snack', 'dessert'];
  } else if (cur_hour < 20 && cur_hour >= 17) {
    return ['dinner'];
  } else {
    return ['tea', 'snack', 'dessert'];
  }
};
