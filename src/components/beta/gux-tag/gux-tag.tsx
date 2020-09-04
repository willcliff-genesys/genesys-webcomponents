import { Component, Element, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'gux-tag.less',
  tag: 'gux-tag-beta'
})
export class GuxTag {
  @Element()
  root: HTMLElement;

  /**
   * Tag icon.
   */
  @Prop()
  icon: string;

  /**
   * Tag background color.
   */
  @Prop()
  color: string;

  /**
   * Label text color.
   */
  @Prop()
  light: boolean;

  /**
   * Label text bold.
   */
  @Prop()
  textBold: boolean;

  /**
   * Tag close button.
   */
  @Prop()
  close: boolean;

  /**
   * Tag border.
   */
  @Prop()
  outlined: boolean;

  render() {
    const colorStyle = this.color && { 'background-color': this.color };
    const labelIcon = this.icon && (
      <div class="gux-tag-icon-wrap">
        <gux-icon decorative icon-name={this.icon} class="gux-tag-icon" />
      </div>
    );
    const closeBtn = this.close && (
      <div class="gux-tag-close-icon-wrap" style={colorStyle}>
        <gux-icon decorative icon-name="ic-close" class="gux-tag-close-icon" />
      </div>
    );
    return (
      <div
        class={`gux-tag  ${this.light ? 'light' : ''} ${
          this.outlined ? 'outlined' : ''
        } ${this.close ? 'close' : ''}`}
      >
        <div
          class={`gux-tag-text ${this.textBold ? 'text-bold' : ''}`}
          style={colorStyle}
        >
          {labelIcon}
          <slot />
        </div>
        {closeBtn}
      </div>
    );
  }
}
