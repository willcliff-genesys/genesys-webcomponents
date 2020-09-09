import {
  Component,
  Element,
  h,
  Listen,
  Prop,
  State,
  Watch
} from '@stencil/core';
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

  @State()
  opened: boolean;
  selectionOptions: HTMLGuxTagPopoverOptionElement[];

  @State()
  tags: any[] = [];

  @State()
  dropdownOpened: boolean;

  @State()
  inputValue: string = '';

  @State()
  index: number = 0;

  @State()
  closeButtons: any;

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!e.relatedTarget) {
      this.dropdownOpened = false;
    }
  }

  @Watch('tags')
  watchHandler() {
    this.closeButtons = Array.from(
      this.root.getElementsByClassName('gux-tag-close-icon-wrap')
    );

    this.closeButtons.map(closeButton => {
      const id = closeButton.closest('gux-tag-beta').id;
      const handler = () => {
        this.deleteTag(id);
      };
      closeButton.addEventListener('click', handler);
    });
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
            icon: option.icon || '',
            index: this.tags.length
          }
        ];
      });
    }
  }

  private deleteTag(id) {
    let tags = this.tags;
    tags = this.tags.filter(tag => tag.index !== +id);
    this.tags = [...tags];
  }

  render() {
    const tags = [];

    this.tags.map(tag => {
      const tagChip = (
        <gux-tag-beta id={tag.index} close icon={tag.icon} color={this.color}>
          {tag.text}
        </gux-tag-beta>
      );
      tags.push(tagChip as HTMLElement);
    });

    return (
      <div
        class={`gux-tag-popover
        ${this.disabled ? 'disabled' : ''}`}
      >
        <div class="gux-tag-popover-container">
          <gux-button
            class="gux-tag-popover-button"
            onMouseDown={() => this.inputMouseDown()}
          >
            <gux-icon decorative iconName="ic-tag"></gux-icon>
          </gux-button>
        </div>
        <div class={`gux-tag-popover-menu ${this.opened ? 'opened' : ''}`}>
          <div class="gux-tag-popover-menu-container">
            <div class="gux-tag-popover-options-container">
              <b class="gux-tag-popover-title">{this.i18n('menuTitle')}</b>
              <div
                class={`gux-tag-popover-chip-container ${
                  this.dropdownOpened ? 'active' : ''
                }`}
              >
                {tags}
                <br />
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

  private addTag(event) {
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

  private inputMouseDown() {
    if (this.disabled) return;

    if (this.opened) {
      this.opened = false;
    } else {
      this.opened = true;
    }
  }
}
