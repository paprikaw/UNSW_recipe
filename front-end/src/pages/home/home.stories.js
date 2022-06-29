// YourComponent.stories.js|jsx
import Home from ".";
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: Home,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <Home {...args} />;
export const home = Template.bind({});
home.args = {
  data: {
    cooker: ["a", "b", "c", "Banana", "Apple"],
    ingredients: ["e", "w", "f"],
    apple: ["3", "2", "1"],
    lol: ["12312312312", "sdadsf", "adsfasdfsda"],
  },
};
