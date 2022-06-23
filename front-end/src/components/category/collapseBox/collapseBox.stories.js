// YourComponent.stories.js|jsx
import CollapseBox from "./index.jsx";
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Category',
  component: CollapseBox,
};

//👇 We create a “template” of how args map to rendering

export const selectBox = () => <CollapseBox/>;
