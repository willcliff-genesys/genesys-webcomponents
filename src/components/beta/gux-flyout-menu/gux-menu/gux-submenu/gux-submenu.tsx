import { createPopper, Instance } from '@popperjs/core';
import { Component, h, Host, JSX, Prop } from '@stencil/core';

@Component({
  styleUrl: 'gux-submenu.less',
  tag: 'gux-submenu'
})
export class GuxSubmenu {
  private labelElement: HTMLDivElement;
  private submenuPopupElement: HTMLDivElement;
  private popperInstance: Instance;
  private labelMouseenterHandler = () => this.forceUpdate();
  private labelClickHandler = (event: MouseEvent) => this.swallowClicks(event);

  @Prop()
  label: string;

  private forceUpdate(): void {
    if (this.popperInstance) {
      this.popperInstance.forceUpdate();
    }
  }

  private swallowClicks(event: MouseEvent): void {
    event.stopPropagation();
  }

  componentDidLoad(): void {
    this.popperInstance = createPopper(
      this.labelElement,
      this.submenuPopupElement,
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-9, 0]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              mainAxis: false
            }
          }
        ],
        placement: 'right-start'
      }
    );

    this.labelElement.addEventListener(
      'mouseenter',
      this.labelMouseenterHandler
    );
    this.labelElement.addEventListener('click', this.labelClickHandler);
  }

  componentDidUnload(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  render(): JSX.Element {
    return (
      <Host>
        <div class="gux-submenu-label" ref={el => (this.labelElement = el)}>
          <div class="gux-submenu-label-text">{this.label}</div>
          <gux-icon
            class="gux-submenu-open-icon"
            icon-name="chevron-right"
            screenreader-text="Open submenu"
          ></gux-icon>
        </div>
        <div
          class="gux-submenu-popup"
          ref={el => (this.submenuPopupElement = el)}
          tabIndex={1}
        >
          <div class="gux-submenu-content">
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
