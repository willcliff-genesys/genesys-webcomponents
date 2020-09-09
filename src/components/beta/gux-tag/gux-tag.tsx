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
   * Tag border.
   */
  @Prop()
  outlined: boolean;

  render() {
    return (
      <div
        class={`gux-tag  ${this.light ? 'light' : ''} ${
          this.outlined ? 'outlined' : ''
        }`}
      >
        <div class="gux-tag-text" style={this.getColorStyle()}>
          {this.getIcon()}
          <slot />
        </div>
        {this.getCloseButton()}
      </div>
    );
  }

  private getColorStyle() {
    return this.color && { 'background-color': this.color };
  }

  private getIcon() {
    return (
      this.icon && (
        <div class="gux-tag-icon-wrap">
          <gux-icon decorative icon-name={this.icon} class="gux-tag-icon" />
        </div>
      )
    );
  }

  private getCloseButton() {
    return (
      <div class="gux-tag-close-icon-wrap" style={this.getColorStyle()}>
        <gux-icon decorative icon-name="ic-close" class="gux-tag-close-icon" />
      </div>
    );
  }
}
