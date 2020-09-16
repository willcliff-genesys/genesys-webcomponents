import { Component, Element, h, Listen, Prop, State } from '@stencil/core';
import { buildI18nForComponent } from '../../../i18n';
import tagPopoverResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-tag-popover.less',
  tag: 'gux-tag-popover-beta'
})
export class GuxTagPopover {
  @Element()
  root: HTMLElement;
  i18n: (resourceKey: string, context?: any) => string;

  /**
   * Disable the button.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * Tags color
   */
  @Prop()
  color: string;

  /**
   * Indicates the position of the tag button (right or left)
   */
  @Prop()
  position: string = 'left';

  @State()
  opened: boolean;
  selectionOptions: HTMLGuxTagPopoverOptionElement[];

  @State()
  tags: any[] = [];

  @State()
  dropdownOpened: boolean;

  @State()
  inputValue: string = '';

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!e.relatedTarget) {
      this.dropdownOpened = false;
    }
  }

  @Listen('deleteTag')
  onDeleteTag(event): void {
    const tags = this.tags;
    tags.splice(event.detail, 1);
    this.tags = [...tags];
  }

  async componentWillLoad() {
    this.i18n = await buildI18nForComponent(this.root, tagPopoverResources);
  }

  componentDidLoad() {
    this.selectionOptions = this.getSelectionOptions();
    for (const option of this.selectionOptions) {
      option.addEventListener('selectedChanged', () => {
        this.dropdownOpened = false;
        this.tags = [
          ...this.tags,
          {
            text: option.text,
            icon: option.icon || ''
          }
        ];
      });
    }
  }

  render() {
    const tags = [];

    this.tags.map((tag, index) => {
      const tagChip = (
        <gux-tag-beta color={this.color} index={index}>
          {tag.text}
        </gux-tag-beta>
      );
      tags.push(tagChip as HTMLGuxTagPopoverOptionElement);
    });

    return (
      <div class={`gux-tag-popover ${this.position}`}>
        <div class="gux-tag-popover-container">
          <gux-button
            class="gux-tag-popover-button"
            disabled={this.disabled}
            onClick={() => this.handlerClickOnMenuButton()}
          >
            <gux-icon decorative iconName="ic-tag"></gux-icon>
          </gux-button>
        </div>
        <div class={`gux-tag-popover-menu ${this.opened ? 'opened' : ''}`}>
          <div class="arrow" />
          <div class="gux-tag-popover-menu-container">
            <div class="gux-tag-popover-options-container">
              <b class="gux-tag-popover-title">{this.i18n('menuTitle')}</b>
              <div
                class={`gux-tag-popover-chip-container ${
                  this.dropdownOpened ? 'active' : ''
                }`}
              >
                {tags}
                <div class="gux-tag-popover-input-container">
                  <input
                    onFocus={() => {
                      this.dropdownOpened = true;
                    }}
                    class="gux-tag-popover-input"
                    value={this.inputValue}
                    onKeyDown={e => this.addTag(e)}
                  />
                  <div
                    class={`gux-tag-popover-options ${
                      this.dropdownOpened ? 'opened' : ''
                    }`}
                  >
                    <slot />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private addTag(event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (event.key === ' ' || event.key === 'Enter') {
      this.inputValue = value;
      if (this.tags.indexOf({ text: value }) !== -1) {
        return;
      }
      if (value.trim().length) {
        this.tags = [...this.tags, { text: value, index: this.tags.length }];
      }

      this.inputValue = event.target.value = '';
    }
  }

  private getSelectionOptions(): HTMLGuxTagPopoverOptionElement[] {
    const result: HTMLGuxTagPopoverOptionElement[] = [];
    const options: HTMLElement = this.root.getElementsByClassName(
      'gux-tag-popover-options'
    )[0] as HTMLElement;
    const childrenElements: any = options.children;

    for (const child of childrenElements) {
      if (child.matches('gux-tag-popover-option')) {
        result.push(child as HTMLGuxTagPopoverOptionElement);
      }
    }
    return result;
  }

  private handlerClickOnMenuButton(): void {
    if (this.disabled) return;
    this.opened = !this.opened;
  }
}
