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
  deleteTag: EventEmitter;

  /**
   * Tag background color.
   */
  @Prop()
  color: string;

  /**
   * Index
   */
  @Prop()
  index: number;

  private handlerClickDeleteTag(): void {
    this.deleteTag.emit(this.index);
  }

  private getDeleteButton() {
    return (
      <button
        type="button"
        onClick={this.handlerClickDeleteTag.bind(this)}
        class={`gux-tag-delete-button ${this.color || ''}`}
      >
        <gux-icon decorative icon-name="ic-close" class="gux-tag-delete-icon" />
      </button>
    );
  }

  render() {
    return (
      <div class="gux-tag">
        <div class={`gux-tag-text ${this.color || ''}`}>
          <slot />
        </div>
        {this.getDeleteButton()}
      </div>
    );
  }
}
