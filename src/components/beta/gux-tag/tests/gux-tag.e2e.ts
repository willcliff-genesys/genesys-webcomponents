import { newE2EPage } from '@stencil/core/testing';

describe('gux-tag-beta', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-tag-beta></gux-tag-beta>');
    const element = await page.find('gux-tag-beta');
    expect(element).toHaveClass('hydrated');
  });

  it('text-bold option', async () => {
    const page = await newE2EPage();
    await page.setContent('<gux-tag-beta text-bold></gux-tag-beta>');
    await page.waitForChanges();

    const tagTextElm = await page.find('.gux-tag-text');
    expect(tagTextElm.className.split(' ')).toContain('text-bold');
  });

  it('close option', async () => {
    const page = await newE2EPage();
    await page.setContent('<gux-tag-beta close></gux-tag-beta>');
    await page.waitForChanges();

    const tagElm = await page.find('.gux-tag');
    expect(tagElm.className.split(' ')).toContain('close');
  });

  it('outlined option', async () => {
    const page = await newE2EPage();
    await page.setContent('<gux-tag-beta outlined></gux-tag-beta>');
    await page.waitForChanges();

    const tagElm = await page.find('.gux-tag');
    expect(tagElm.className.split(' ')).toContain('outlined');
  });

  it('light option', async () => {
    const page = await newE2EPage();
    await page.setContent('<gux-tag-beta light></gux-tag-beta>');
    await page.waitForChanges();

    const tagElm = await page.find('.gux-tag');
    expect(tagElm.className.split(' ')).toContain('light');
  });
});
