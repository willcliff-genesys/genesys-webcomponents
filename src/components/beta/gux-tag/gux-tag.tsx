import {
  Component,
  Element,
  h,
  Prop,
  Event,
  EventEmitter
} from '@stencil/core';

@Component({
  styleUrl: 'gux-tag.less',
  tag: 'gux-tag-beta'
})
export class GuxTag {
  @Element()
  root: HTMLElement;

  /**
   * Triggered when click on close button
   */
  @Event()
  close: EventEmitter;

  /**
   * Tag background color.
   */
  @Prop()
  color: string;

  handlerClickClose() {
    this.close.emit();
  }

  private getCloseButton() {
    return (
      <button
        type="button"
        onClick={() => this.handlerClickClose()}
        class={`gux-tag-close-button ${this.color}`}
      >
        <gux-icon decorative icon-name="ic-close" class="gux-tag-close-icon" />
      </button>
    );
  }

  render() {
    return (
      <div class="gux-tag">
        <div class={`gux-tag-text ${this.color}`}>
          <slot />
        </div>
        {this.getCloseButton()}
      </div>
    );
  }
}
