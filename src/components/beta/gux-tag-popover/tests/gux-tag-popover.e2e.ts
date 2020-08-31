import { newE2EPage } from '@stencil/core/testing';

describe('gux-tag-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<gux-tag-popover-beta lang="en"></gux-tag-popover-beta>'
    );
    const element = await page.find('gux-tag-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('opens drop down on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-tag-popover-beta lang="en">
        <gux-tag-popover-option value="en" text="English"></gux-tag-popover-option>
        <gux-tag-popover-option value="nl" text="Dutch"></gux-tag-popover-option>
      </gux-tag-popover-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover');
    const inputElm = await element.find('.gux-select-input');
    inputElm.click();
    await page.waitForChanges();

    const dropMenuElm = await element.find('.gux-tag-popover-menu');
    expect(dropMenuElm.className.split(' ')).toContain('opened');
  });

  it('selects an item when an option is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-tag-popover-beta lang="en">
        <gux-tag-popover-option value="en" text="English"></gux-tag-popover-option>
        <gux-tag-popover-option value="nl" text="Dutch"></gux-tag-popover-option>
      </gux-tag-popover-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover');
    const inputSpy = await element.spyOnEvent('input');

    const inputElm = await element.find('.gux-select-input');
    inputElm.click();
    await page.waitForChanges();

    let dropMenuElm = await element.find('.gux-tag-popover-menu');
    const enElm = await dropMenuElm.find('gux-tag-popover-option');
    enElm.click();
    await page.waitForChanges();
    dropMenuElm = await element.find('.gux-tag-popover-menu');

    expect(inputSpy).toHaveReceivedEventDetail('en');
    expect(dropMenuElm.className.split(' ')).not.toContain('opened');
  });

  it('Should fire filter event with a delay', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <gux-tag-popover-beta lang="en" filter-debounce-timeout="100">
      <gux-tag-popover-option value="en" text="English"></gux-tag-popover-option>
      <gux-tag-popover-option value="nl" text="Dutch"></gux-tag-popover-option>
    </gux-tag-popover-beta>
  `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover');
    const filterSpy = await element.spyOnEvent('filter');

    const inputElm = await element.find('.gux-select-input');
    inputElm.click();
    await page.waitForChanges();

    const guxSearch = await element.find('gux-search-beta');
    guxSearch.setProperty('value', 'en');
    await page.waitForChanges();

    await page.waitFor(200);

    expect(filterSpy).toHaveReceivedEventDetail('en');
  });

  it('Should not filter if filterLocal is false', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-tag-popover-beta lang="en" filter-debounce-timeout="0" no-filter>
        <gux-tag-popover-option value="en" text="English"></gux-tag-popover-option>
        <gux-tag-popover-option value="nl" text="Dutch"></gux-tag-popover-option>
      </gux-tag-popover-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover');
    const filterSpy = await element.spyOnEvent('filter');

    const inputElm = await element.find('.gux-select-input');
    inputElm.click();
    await page.waitForChanges();

    const guxSearch = await element.find('gux-search-beta');
    guxSearch.setProperty('value', 'en');
    await page.waitForChanges();

    const items = await element.findAll('gux-tag-popover-option');

    expect(items).toHaveLength(2);
    expect(filterSpy).toHaveReceivedEventDetail('en');
  });
});
