// YourComponent.stories.js|jsx
import Filter from '.';
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: Filter,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <Filter {...args} />;
export const filter = Template.bind({});
filter.args = {
  recipeId: 1,
  username: 'Qing',
  recipeName: "Buddha's delight",
  mealType: 'Lunch, Dinner',
  likes: 99,
  cookTime: 20,
  thumbnailPath:
    'https://cp1.douguo.com/upload/caiku/3/1/d/yuan_3168b8c616522ae87e246cf7a559271d.jpg',
  ingredients: [
    {
      name: 'Ground Beef',
      quantity: 200,
      unit: 'g',
    },
    {
      name: 'White Flour',
      quantity: 100,
      unit: 'g',
    },
    {
      name: 'Salt',
      quantity: 3,
      unit: 'g',
    },
  ],
  steps: ['1. Fry ground beef.', '2. Add salt', '3. Add flour'],
};
