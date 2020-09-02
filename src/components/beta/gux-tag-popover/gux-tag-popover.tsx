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
          { text: option.text, icon: option.icon || '' }
        ];
      });
    }
  }

  private getTagChip(
    tag: HTMLGuxTagPopoverOptionElement,
    icon: string,
    index: number
  ): HTMLGuxTagPopoverOptionElement {
    const tagColorStyle = this.color && { 'background-color': this.color };
    return (
      <div class="gux-tag-popover-chip">
        <div class="gux-tag-popover-chip-text" style={tagColorStyle}>
          {icon}
          {tag.text}
        </div>
        <div
          class="gux-tag-popover-chip-close-icon-wrap"
          style={tagColorStyle}
          onClick={() => this.deleteTag(index)}
        >
          <gux-icon
            decorative
            icon-name="ic-close"
            class="gux-tag-popover-chip-close-icon"
          />
        </div>
      </div>
    );
  }

  render() {
    const tags = [];

    this.tags.map((tag, index) => {
      const icon = tag.icon && (
        <div class="gux-tag-popover-chip-icon-wrap">
          <gux-icon
            decorative
            icon-name={tag.icon}
            class="gux-tag-popover-chip-icon"
          />
        </div>
      );

      const tagChip = this.getTagChip(tag, icon, index);
      tags.push(tagChip as HTMLGuxTagPopoverOptionElement);
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

  updateValue(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.inputValue = value;
  }

  private deleteTag(index) {
    // Hack for re-render after remove array element
    const tags = this.tags;
    this.tags.splice(index, 1);
    this.tags = [...tags];
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
        this.tags.push({ text: value });
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
