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

  describe('Class Logic', () => {
    describe('shouldFilter', () => {
      it('should not filter if no search string is provided', async () => {
        const result = await component.shouldFilter('');

        expect(result).toBeFalsy();
      });

      it('should not filter if string is in the text', async () => {
        component.text = 'TestsAreAwesome';

        const result = await component.shouldFilter('Are');

        expect(result).toBeFalsy();
        expect(component.highlight).toBe('Are');
        expect(component.highlightIndex).toBe(5);
      });

      it('should not filter if case-insensitive string is in the text', async () => {
        component.text = 'TestsAreAwesome';

        const result = await component.shouldFilter('are');

        expect(result).toBeFalsy();
        expect(component.highlight).toBe('are');
        expect(component.highlightIndex).toBe(5);
      });

      it('should filter if string is not in the text', async () => {
        component.text = 'TestsAreAwesome';

        const result = await component.shouldFilter('Not');

        expect(result).toBeTruthy();
      });
    });
  });
});
