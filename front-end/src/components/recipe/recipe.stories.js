// YourComponent.stories.js|jsx
import Recipe from '.';
import Instruction from '.';
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: Recipe,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <Recipe {...args} />;
export const recipe = Template.bind({});
recipe.args = {
  recipeId: 1,
  username: 'Qing',
  recipeName: "Buddha's delight",
  mealType: 'Lunch, Dinner',
  likes: 99,
  cookTime: 20,
  thumbnailPath:
    'https://cp1.douguo.com/upload/caiku/3/1/d/yuan_3168b8c616522ae87e246cf7a559271d.jpg',
  ingredients: 'something',
  steps: 'This is the instruction',
};
