// import '!style-loader!css-loader!../src/styles/styles.scss';
import { configure } from '@storybook/angular';

const requireContext = require.context('../src/lib/', true, /\.stories\.ts$/);
function loadStories() {
  requireContext.keys().forEach(filename => requireContext(filename));
}

configure(loadStories, module);
