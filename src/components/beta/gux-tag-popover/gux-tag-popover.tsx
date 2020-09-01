import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
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
  searchElement: HTMLGuxSearchBetaElement;
  inputBox: HTMLElement;
  i18n: (resourceKey: string, context?: any) => string;

  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The dropdown's placeholder.
   */
  @Prop()
  placeholder: string;

  /**
   * Whether the list should filter its current options.
   */
  @Prop()
  noFilter: boolean = false;

  /**
   * Timeout between filter input changed and event being emitted.
   */
  @Prop()
  filterDebounceTimeout: number = 500;

  /**
   * Fires when the value of the advanced dropdown changes.
   */
  @Event()
  input: EventEmitter<string>;

  /**
   * Fires when the filter of the advanced dropdown changes.
   */
  @Event()
  filter: EventEmitter<string>;

  @State()
  srLabelledby: string;

  @State()
  opened: boolean;
  dropdownOpened: boolean = false;
  value: string;
  currentlySelectedOption: HTMLGuxTagPopoverOptionElement;
  selectionOptions: HTMLGuxTagPopoverOptionElement[];

  @State()
  tags = ['1', '2', '44'];

  @State()
  inputValue: string = '';

  @Watch('disabled')
  watchValue(newValue: boolean) {
    if (this.opened && newValue) {
      this.closeDropdown(false);
    }
  }

  @Event()
  change: EventEmitter<string>;
  emitChange(value: string) {
    this.change.emit(value);
  }

  /**
   * Gets the currently selected values.
   *
   * @returns The array of selected values.
   */
  @Method()
  getSelectedValues(): Promise<string[]> {
    // Once multi-select gets added there will
    // be multiple values selectable.
    return Promise.resolve([this.value]);
  }

  @Method()
  async setLabeledBy(id: string) {
    this.srLabelledby = id;
  }

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!e.relatedTarget || !this.root.contains(e.relatedTarget as Node)) {
      // this.closeDropdown(false); TODO
    }
  }

  async componentWillLoad() {
    this.i18n = await buildI18nForComponent(this.root, tagPopoverResources);
  }

  componentDidLoad() {
    this.selectionOptions = this.getSelectionOptions();
    for (const option of this.selectionOptions) {
      option.addEventListener('selectedChanged', () => {
        this.inputValue = '1'; // TODO fix
        this.inputValue = '';
        this.dropdownOpened = false;
        this.tags.push(option.text);
      });
    }
  }

  render() {
    const tags = [];
    this.tags.map((tag, index) => {
      const ar = (
        <div class="gux-tag-popover-chip">
          <div class="gux-tag-popover-chip-text">{tag}</div>
          <div
            class="gux-tag-popover-chip-icon-wrap"
            onClick={() => this.deleteTag(index)}
          >
            <gux-icon
              decorative
              icon-name="ic-close"
              class="gux-tag-popover-chip-icon"
            />
          </div>
        </div>
      );
      tags.push(ar);
    });
    return (
      <div
        class={`gux-tag-popover 
        ${this.disabled ? 'disabled' : ''}
        ${this.opened ? 'active' : ''}`}
      >
        <div class="gux-select-field">
          <gux-button
            ref={el => (this.inputBox = el)}
            class="gux-select-input"
            aria-labelledby={this.srLabelledby}
            tabindex="0"
            onMouseDown={() => this.inputMouseDown()}
            onKeyDown={e => this.inputKeyDown(e)}
          >
            <gux-icon decorative iconName="ic-tag"></gux-icon>
          </gux-button>
        </div>
        <div class={`gux-tag-popover-menu ${this.opened ? 'opened' : ''}`}>
          <div class="gux-tag-popover-menu-container">
            <div class="gux-tag-popover-search-container">
              <b class="gux-tag-popover-title">{this.i18n('searchTitle')}</b>
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
                      this.inputValue = '1'; // TODO fix
                      this.inputValue = '';
                    }}
                    class="gux-tag-popover-input"
                    value={this.inputValue}
                    onKeyDown={e => this.addTag(e)}
                  />
                  <div
                    class={`gux-tag-popover-dropdown gux-tag-popover-options opened ${
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
    this.inputValue = '1'; // TODO fix
    this.inputValue = '';
    this.tags.splice(index, 1);
  }

  private addTag(event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (event.key === ' ' || event.key === 'Enter') {
      this.inputValue = value;
      if (this.tags.indexOf(value) !== -1) {
        return;
      }
      if (!value.trim().length) return;
      this.tags.push(value);
      this.inputValue = event.target.value = '';
    }
  }

  private getSelectionOptions(): HTMLGuxTagPopoverOptionElement[] {
    const result: HTMLGuxTagPopoverOptionElement[] = [];
    const options: HTMLElement = this.root.getElementsByClassName(
      'gux-tag-popover-options'
    )[0] as HTMLElement;

    // Hack around TSX not supporting for..of on HTMLCollection, this
    // needs to be tested in IE11
    const childrenElements: any = options.children;

    for (const child of childrenElements) {
      if (child.matches('gux-tag-popover-option')) {
        // TODO rename optionS
        result.push(child as HTMLGuxTagPopoverOptionElement);
      }
    }
    return result;
  }

  private inputMouseDown() {
    if (this.disabled) {
      return;
    }

    if (this.opened) {
      this.closeDropdown(true);
    } else {
      this.openDropdown(false);
    }
  }

  // private getFocusIndex(): number {
  //   return this.selectionOptions.findIndex(option => {
  //     return option.matches(':focus');
  //   });
  // }

  // private optionsKeyDown(event: KeyboardEvent) {
  //   switch (event.key) {
  //     case 'ArrowUp': {
  //       const focusIndex = this.getFocusIndex();
  //       if (focusIndex > 0) {
  //         this.selectionOptions[focusIndex - 1].focus();
  //       }
  //       break;
  //     }
  //     case 'ArrowDown': {
  //       const focusIndex = this.getFocusIndex();
  //       if (focusIndex < this.selectionOptions.length - 1) {
  //         this.selectionOptions[focusIndex + 1].focus();
  //       }
  //       break;
  //     }
  //     case 'Home':
  //       if (!this.selectionOptions.length) {
  //         return;
  //       }
  //       this.selectionOptions[0].focus();
  //       break;
  //     case 'End':
  //       if (!this.selectionOptions.length) {
  //         return;
  //       }
  //       this.selectionOptions[this.selectionOptions.length - 1].focus();
  //       break;
  //     default:
  //   }
  // }

  private inputKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        this.openDropdown(true);
        break;
      default:
    }
  }

  private changeFocusToSearch() {
    setTimeout(() => {
      this.searchElement.setInputFocus();
    });
  }

  private openDropdown(focusSearch: boolean) {
    this.opened = true;

    if (focusSearch) {
      this.changeFocusToSearch();
    }
  }

  private closeDropdown(focus: boolean) {
    this.opened = false;
    this.searchElement.value = '';

    if (focus) {
      this.inputBox.focus();
    }
  }
}
