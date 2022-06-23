// YourComponent.stories.js|jsx
import Category from ".";
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Category',
  component: Category,
};

//👇 We create a “template” of how args map to rendering

export const category = () => <Category/>;