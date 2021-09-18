import { Directive, HostListener, Input, HostBinding } from '@angular/core';

export interface CreditCard {
  name: string;
  fullName: string;
  re: RegExp;
  pattern: RegExp;
  maxLength: number;
  cvvLength: number;
}

@Directive({
  selector: '[mdbCreditCard]',
  exportAs: 'mdbCreditCard'
})
export class MdbCreditCardDirective {
  private standardPattern = /(\d{1,4})/g;
  cardName: string;
  cardFullName: string;

  private defaultCard: CreditCard = {
    name: '',
    fullName: '',
    re: /\d{0,16}/,
    pattern: this.standardPattern,
    maxLength: 19,
    cvvLength: 3
  };

  private cards: CreditCard[] = [
    {
      name: 'visa',
      fullName: 'Visa',
      re: /^4\d{0,15}/,
      pattern: this.standardPattern,
      maxLength: 16,
      cvvLength: 3
    },
    {
      name: 'mastercard',
      fullName: 'Mastercard',
      re: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      pattern: this.standardPattern,
      maxLength: 16,
      cvvLength: 3
    },
    {
      name: 'amex',
      fullName: 'American Express',
      re: /^3[47]\d{0,13}/,
      pattern: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
      maxLength: 15,
      cvvLength: 4
    },
    {
      name: 'jcb',
      fullName: 'JCB',
      re: /^(?:35\d{0,2})\d{0,12}/,
      pattern: this.standardPattern,
      maxLength: 19,
      cvvLength: 3
    },
    {
      name: 'discover',
      fullName: 'Discover',
      re: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      pattern: this.standardPattern,
      maxLength: 19,
      cvvLength: 3
    },
    {
      name: 'diners-club',
      fullName: 'Diners Club',
      re: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
      pattern: /(\d{1,4})(\d{1,5})?(\d{1,4})?/,
      maxLength: 19,
      cvvLength: 3
    }
  ];

  @Input()
  get additionalCards() { return this._additionalCards; }
  set additionalCards(cards: CreditCard[]) {
    this._additionalCards = cards;
    this.addCards(cards);
  }
  private _additionalCards: CreditCard[];

  @Input()
  get separator() { return this._separator; }
  set separator(separator: string) {
    this._separator = separator;
  }
  private _separator = ' ';

  constructor() {}

  @HostBinding('attr.maxLength') maxLength: string;

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.formatInput(event);
  }

  private formatInput(event: any) {
    const input = event.target.value;
    const formattedInput = this.getFormattedInput(input);
    event.target.value = formattedInput;
  }

  private getFormattedInput(value: string) {
    value = this.removeNonDigits(value);
    const card = this.findCardByNumber(value);

    this.updateCurrentCardNames(card.name, card.fullName);

    let cardNumMaxLength: number;

    if (this.hasStandardPattern(card)) {
      const matches: RegExpMatchArray | null = value.match(card.pattern);

      if (matches === null) {
        return value;
      }

      cardNumMaxLength = card.maxLength + matches.length - 1;
      this.maxLength = cardNumMaxLength.toString();
      return matches.join(this.separator);

    } else {
      const results: RegExpExecArray | null = card.pattern.exec(value);

      if (results === null) {
        return value;
      }
      results.shift();
      cardNumMaxLength = card.maxLength + results.length - 1;
      this.maxLength = cardNumMaxLength.toString();
      return results.filter(this.isMatch).join(this.separator);
    }
  }

  private removeNonDigits(value: string) {
    return value.replace(/\D/g, '');
  }

  private hasStandardPattern(card: CreditCard) {
    return card.pattern.toString() === this.standardPattern.toString();
  }

  private isMatch(match: string) {
    return match !== undefined;
  }

  private updateCurrentCardNames(name: string, fullName: string) {
    this.cardName = name;
    this.cardFullName = fullName;
  }

  private findCardByNumber(value: string) {
    const cardType = this.cards.find( (card) => {
      return card.re.test(value);
    });

    if (!cardType) {
      return this.defaultCard;
    }

    return cardType;
  }

  public addCards(newCards: CreditCard[]) {
    newCards.forEach( (card) => {
      this.cards.push(card);
    });
  }
}
