// YourComponent.stories.js|jsx
import Thumbnail from '.';
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: Thumbnail,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <Thumbnail {...args} />;
export const thumbnail = Template.bind({});
thumbnail.args = {
  recipeId: 1,
  recipeName: 'Martini',
  mealType: 'Cocktail',
  likes: 100,
  cookTime: 5,
  thumbnail:
    'https://ministryofhemp.com/wp-content/uploads/2018/09/Cosmopolitan-shutterstock_772042387-1-e1537293496842.jpg',
  numIngredientsMatched: 4,
};
