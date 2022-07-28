// YourComponent.stories.js|jsx
import SuggestionBox from './index.jsx';
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: SuggestionBox,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <SuggestionBox {...args} />;
export const suggestionBox = Template.bind({});
