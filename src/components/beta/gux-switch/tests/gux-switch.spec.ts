import { newSpecPage } from '@stencil/core/testing';
import '../../../../components';

import { GuxSwitch } from '../gux-switch';
import { GuxSwitchitem } from '../gux-switch-item/gux-switch-item';

global.InputEvent = Event;

const components = [GuxSwitch, GuxSwitchitem];
const html = `
  <gux-switch-beta layout="small" value="day">
    <gux-switch-item value="month">Month</gux-switch-item>
    <gux-switch-item value="week">Week</gux-switch-item>
    <gux-switch-item value="day">Day</gux-switch-item>
    <gux-switch-item value="hour" disabled>Hour</gux-switch-item>
    <gux-switch-item value="minute">Minute</gux-switch-item>
  </gux-switch-beta>
`;
const language = 'en';

describe('gux-switch', () => {
  describe('#render', () => {
    it(`should render as expected`, async () => {
      const page = await newSpecPage({ components, html, language });

      expect(page.rootInstance).toBeInstanceOf(GuxSwitch);
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('#interactions', () => {
    it(`should change value on gux-switch-item click`, async () => {
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLGuxSwitchBetaElement;
      const guxSwitchItemMinute = page.root.querySelector(
        'gux-switch-item[value=minute]'
      ) as HTMLGuxSwitchItemElement;

      expect(element.value).toBe('day');

      guxSwitchItemMinute.click();
      await page.waitForChanges();

      expect(element.value).toBe(guxSwitchItemMinute.value);
    });

    it(`should not change value on gux-switch-item click if it is disabled`, async () => {
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLGuxSwitchBetaElement;
      const guxSwitchItemHour = page.root.querySelector(
        'gux-switch-item[value=hour]'
      ) as HTMLGuxSwitchItemElement;
      const currentValue = element.value;

      expect(currentValue).toBe('day');

      guxSwitchItemHour.click();
      await page.waitForChanges();

      expect(element.value).toBe(currentValue);
    });

    it(`should emit a 'change' and 'input' event when a new item is selected`, async () => {
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLGuxSwitchBetaElement;
      const guxSwitchItemMinute = page.root.querySelector(
        'gux-switch-item[value=minute]'
      ) as HTMLGuxSwitchItemElement;
      const changeEventSpy = jest.fn();
      const inputEventSpy = jest.fn();

      element.addEventListener('change', () => {
        changeEventSpy();
      });
      element.addEventListener('input', () => {
        inputEventSpy();
      });

      guxSwitchItemMinute.click();
      await page.waitForChanges();

      expect(changeEventSpy).toHaveBeenCalledWith();
      expect(inputEventSpy).toHaveBeenCalledWith();
    });

    it(`should not emit a 'change' or 'input' event when a disabled item is selected`, async () => {
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLGuxSwitchBetaElement;
      const guxSwitchItemHour = page.root.querySelector(
        'gux-switch-item[value=hour]'
      ) as HTMLGuxSwitchItemElement;
      const changeEventSpy = jest.fn();
      const inputEventSpy = jest.fn();

      element.addEventListener('change', () => {
        console.info('change');
        changeEventSpy();
      });
      element.addEventListener('input', () => {
        console.info('change');
        inputEventSpy();
      });

      guxSwitchItemHour.click();
      await page.waitForChanges();

      expect(changeEventSpy).not.toHaveBeenCalled();
      expect(inputEventSpy).not.toHaveBeenCalled();
    });
  });
});
