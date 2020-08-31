import { newSpecPage } from '@stencil/core/testing';
import { GuxTagPopover } from '../gux-tag-popover';

describe('gux-tag-popover', () => {
  it('should render', async () => {
    const page = await newSpecPage({
      components: [GuxTagPopover],
      html: `
        <gux-tag-popover-beta lang="en">
          <gux-tag-popover-option value="en" text="English"></gux-tag-popover-option>
          <gux-tag-popover-option value="nl" text="Dutch"></gux-tag-popover-option>
        </gux-tag-popover-beta>
      `,
      language: 'en'
    });

    expect(page.root).toMatchSnapshot();
  });
});
