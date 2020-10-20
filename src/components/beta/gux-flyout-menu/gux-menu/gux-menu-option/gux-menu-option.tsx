import { Component, Element, h, JSX, Listen, Method } from '@stencil/core';

@Component({
  styleUrl: 'gux-menu-option.less',
  tag: 'gux-menu-option'
})
export class GuxMenuOption {
  private buttonElement: HTMLButtonElement;

  @Element()
  private root: HTMLGuxMenuOptionElement;

  /**
   * Focus on the components button element
   */
  @Method()
  async guxFocus(): Promise<void> {
    this.buttonElement.focus();
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        const previousFocusableElement = this.root
          .previousElementSibling as HTMLGuxMenuOptionElement;

        if (previousFocusableElement) {
          previousFocusableElement.guxFocus();
        }

        event.stopPropagation();

        return;

      case 'ArrowDown':
        const nextFocusableElement = this.root
          .nextElementSibling as HTMLGuxMenuOptionElement;

        if (nextFocusableElement) {
          nextFocusableElement.guxFocus();
        }

        event.stopPropagation();

        return;

      case 'ArrowRight':
        event.stopPropagation();

        return;
    }
  }

  render(): JSX.Element {
    return (
      <button
        type="button"
        class="gux-menu-option-button"
        tabIndex={-1}
        ref={el => (this.buttonElement = el)}
      >
        <span class="gux-menu-option-button-text">
          <slot />
        </span>
      </button>
    );
  }
}
