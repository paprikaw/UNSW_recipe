// YourComponent.stories.js|jsx
import CollapseBox from "./index.jsx";
//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'collapseBox',
  component: CollapseBox,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <CollapseBox {...args} />;
export const collapseBox = Template.bind({});
collapseBox.args = {
  data: ['bahhhhhhhhnana', 'apple', 'aault', 'happy'  ,'vault', 'cault', 'dault', 'eault', 'fault', 'xault', 'zault', 'cault', 'vault', ],
  title: 'Lol',
}