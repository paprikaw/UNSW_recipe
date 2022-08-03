// Remove emoji from the string
export function getRidOfEmoji(name) {
  return name.split(' ').slice(1).join(' ');
}
// change mealtype string to list words
export function changeToList(string) {
  return string.split(' ');
}

// check filter, match filter type and return list of recipe data
export function filterMatch(data, value) {
  let result = [];
  data.forEach((recipe) => {
    recipe.mealType.forEach((type) => {
      value.forEach((param) => {
        if (param === type) {
          result.push(recipe);
        }
      });
    });
  });
  return result;
}
// check sorter, match sort type and return list of recipe data
export function sortMatch(data, value) {
  let result = [];
  if (value === 'Ascending') {
    result = data.sort((a, b) => a.likes - b.likes);
  } else {
    result = data.sort((a, b) => b.likes - a.likes);
  }
  return result;
}
// initialThumbnails

export const curMealType = () => {
  const cur_hour = new Date().getHours();
  if (cur_hour <= 10 && cur_hour > 6) {
    return ['breakfast'];
  } else if (cur_hour <= 12 && cur_hour > 10) {
    return ['tea', 'snack', 'dessert'];
  } else if (cur_hour <= 14 && cur_hour > 12) {
    return ['lunch'];
  } else if (cur_hour <= 17 && cur_hour > 14) {
    return ['tea', 'snack', 'dessert'];
  } else if (cur_hour <= 20 && cur_hour > 17) {
    return ['dinner'];
  } else if (
    (cur_hour < 24 && cur_hour > 17) ||
    (cur_hour >= 0 && cur_hour <= 6)
  ) {
    return ['tea', 'snack', 'dessert'];
  }
};
