import { Component, Element, h, Host, Listen, JSX, Prop } from '@stencil/core';

import { AllowedLayouts } from './gux-switch.types';

import simulateNativeEvent from '../../../utils/simulate-native-event/simulate-native-event';

/**
 * @slot - list of gux-switch-item elements
 */
@Component({
  styleUrl: 'gux-switch.less',
  tag: 'gux-switch-beta'
})
export class GuxSwitch {
  @Element() root: HTMLElement;

  /**
   * Used to keep track of the currently selected value
   */
  @Prop({ mutable: true })
  value: string;

  /**
   * The allowed sizes
   */
  @Prop()
  layout: AllowedLayouts = 'default';

  @Listen('click')
  onClick(e: MouseEvent): void {
    e.stopPropagation();

    const switchItem = (e.target as HTMLElement).closest('gux-switch-item');

    if (switchItem && this.value !== switchItem.value) {
      this.value = switchItem.value;

      simulateNativeEvent(this.root, 'input');
      simulateNativeEvent(this.root, 'change');
    }
  }

  private updateSelectedItem(switchItems: HTMLGuxSwitchItemElement[]): void {
    switchItems.forEach(switchItem => {
      if (switchItem.value === this.value) {
        switchItem.classList.add('gux-selected');
      } else {
        switchItem.classList.remove('gux-selected');
      }
    });
  }

  render(): JSX.Element {
    this.updateSelectedItem(
      Array.from(this.root.children) as HTMLGuxSwitchItemElement[]
    );

    return (
      <Host role="group" class={`gux-${this.layout}`}>
        <slot />
      </Host>
    );
  }
}
