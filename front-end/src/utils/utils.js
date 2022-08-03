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
