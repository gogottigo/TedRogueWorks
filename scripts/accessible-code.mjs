/** Shiki transformer: keyboard-scrollable code blocks in generated HTML, no JS needed. */
export default {
  name: 'trw-accessible-code',
  pre(node) {
    node.properties.tabindex = 0;
  },
};
