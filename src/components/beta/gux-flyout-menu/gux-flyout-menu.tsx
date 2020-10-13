import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  h,
  JSX,
  Listen,
  Prop,
  State,
  Watch
} from '@stencil/core';

@Component({
  styleUrl: 'gux-flyout-menu.less',
  tag: 'gux-flyout-menu-beta'
})
export class GuxFlyoutMenu {
  private hideDelayTimeout: NodeJS.Timer;
  private popperInstance: Instance;
  private forElement: HTMLElement;
  private mouseenterHandler = () => this.show();
  private mouseleaveHandler = () => this.hide();

  @Element() private element: HTMLElement;

  /**
   * Indicates the id of the element the flyout-menu should anchor to
   */
  @Prop()
  for: string;

  @Watch('isShown')
  watchHidden() {
    if (this.popperInstance) {
      this.popperInstance.forceUpdate();
    }
  }

  @State()
  isShown: boolean = false;

  @Listen('click')
  onClick() {
    if (this.isShown) {
      this.hide();
    }
  }

  private runPopper(): void {
    if (this.forElement) {
      this.popperInstance = createPopper(this.forElement, this.element, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 7]
            }
          },
          {
            name: 'arrow',
            options: {
              padding: 16 // 16px from the edges of the popper
            }
          }
        ],
        placement: 'bottom-start'
      });
    } else {
      console.error(
        `GUX-FlyoutMenu: invalid element supplied to 'for': "${this.for}"`
      );
    }
  }

  private destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private show(): void {
    clearTimeout(this.hideDelayTimeout);
    this.isShown = true;
  }

  private hide(): void {
    this.hideDelayTimeout = setTimeout(() => {
      this.isShown = false;
    }, 100);
  }

  async componentWillLoad(): Promise<void> {
    this.forElement = document.getElementById(this.for);
  }

  componentDidLoad(): void {
    this.forElement.addEventListener('mouseenter', this.mouseenterHandler);
    this.forElement.addEventListener('mouseleave', this.mouseleaveHandler);
    this.element.addEventListener('mouseenter', this.mouseenterHandler);
    this.element.addEventListener('mouseleave', this.mouseleaveHandler);
    this.runPopper();
  }

  componentDidUnload(): void {
    this.destroyPopper();
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-flyout-menu-wrapper': true,
          'gux-shown': this.isShown
        }}
      >
        <div class="gux-arrow" data-popper-arrow />
        <div class="gux-flyout-menu-content">
          <slot />
        </div>
      </div>
    );
  }
}
