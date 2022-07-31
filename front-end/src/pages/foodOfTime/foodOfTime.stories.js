// YourComponent.stories.js|jsx
import FoodOfTime from '.';
import { React } from 'react';
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: FoodOfTime,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <FoodOfTime {...args} />;

export const foodOfTime = Template.bind({});
foodOfTime.args = {
  recipes: [
    {
      recipeId: 1,
      recipeName: 'milk:',
      cookTime: 20,
      likes: 20,
      thumbnail:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F0%2F0e%2FMilk_glass.jpg&f=1&nofb=1',
      mealType: 'Lunch',
    },
  ],
};
