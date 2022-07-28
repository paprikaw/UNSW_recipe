// YourComponent.stories.js|jsx
import IngredientSet from '.';
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: IngredientSet,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <IngredientSet {...args} />;
export const ingredientSet = Template.bind({});
ingredientSet.args = {};
