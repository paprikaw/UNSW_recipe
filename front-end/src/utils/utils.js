// Remove emoji from the string
export function getRidOfEmoji(name) {
  return name.split(' ').slice(1).join(' ');
}
// Remove emoji from the string
export function changeToList(string) {
  return string.split(' ');
}
