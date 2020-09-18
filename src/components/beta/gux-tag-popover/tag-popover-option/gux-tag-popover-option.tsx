import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from '@stencil/core';

@Component({
  tag: 'gux-tag-popover-option'
})
export class GuxTagPopoverOption {
  @Element()
  root: HTMLGuxTagPopoverOptionElement;
  slotContent: HTMLElement;

  @Prop()
  text: string;

  @Event()
  selectedChanged: EventEmitter<HTMLElement>;

  componentWillLoad() {
    if (!this.text) {
      this.text = this.root.textContent;
    }
  }

  componentDidLoad() {
    this.root.onclick = () => {
      this.selectedChanged.emit(this.slotContent);
    };
  }

  hostData() {
    return {
      tabindex: '0'
    };
  }

  render() {
    return (
      <div>
        <span
          ref={el => (this.slotContent = el as HTMLElement)}
          style={{ display: 'none' }}
        >
          <slot />
        </span>
        <gux-text-highlight text={this.text} />
      </div>
    );
  }
}
