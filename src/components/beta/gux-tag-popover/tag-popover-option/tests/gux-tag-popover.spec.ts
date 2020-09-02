import { newSpecPage } from '@stencil/core/testing';
import { GuxTagPopoverOption } from '../gux-tag-popover-option';

describe('gux-tag-popover-option', () => {
  let component: GuxTagPopoverOption;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxTagPopoverOption],
      html: `<gux-tag-popover-option></gux-tag-popover-option>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxTagPopoverOption);
  });
});
