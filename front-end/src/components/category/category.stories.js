// YourComponent.stories.js|jsx
import Category from ".";
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  component: Category,
};

//👇 We create a “template” of how args map to rendering

const Template = (args) => <Category {...args} />;
export const category = Template.bind({});
category.args = {
  data: {
      'cooker': ['a', 'b', 'c', "Banana", "Apple", ],
      'ingredients': ['e', 'w', 'f'],
      'apple': ['3', '2', '1'],
      'lol': ['12312312312', 'sdadsf', 'adsfasdfsda'],
  }
}