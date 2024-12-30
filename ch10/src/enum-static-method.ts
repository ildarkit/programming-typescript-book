enum Color {
  Red,
  Green,
  Yellow
}

namespace Color {
  export function getRedColor(): Color {
    return Color.Red;
  }
  export function nextColor(color: Color): Color {
    const nextValue = color + 1;
    return nextValue in Color ? nextValue : Color.Red;
  }
}

const redColor = Color.getRedColor();
console.log(redColor);
console.log(Color.nextColor(redColor));
