import { Component, h, JSX } from '@stencil/core';

@Component({
  styleUrl: 'gux-menu-option.less',
  tag: 'gux-menu-option'
})
export class GuxMenuOption {
  render(): JSX.Element {
    return (
      <button class="gux-menu-option-button">
        <span class="gux-menu-option-button-text">
          <slot />
        </span>
      </button>
    );
  }
}
