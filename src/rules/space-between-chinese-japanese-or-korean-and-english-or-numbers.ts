import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {updateBoldText, updateItalicsText} from '../utils/mdast';

class SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions
implements Options {}

@RuleBuilder.register
export default class SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers extends RuleBuilder<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions> {
  get OptionsClass(): new () => SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions {
    return SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions;
  }
  get name(): string {
    return 'Space between Chinese Japanese or Korean and English or numbers';
  }
  get description(): string {
    return 'Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(
      text: string,
      options: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions,
  ): string {
    const head =
      /(\p{sc=Han}|\p{sc=Katakana}|\p{sc=Hiragana}|\p{sc=Hangul})( *)(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+'"([{¥$]|\*[^*])/gmu;
    const tail =
      /(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+;:'"°%$)\]}]|[^*]\*)( *)(\p{sc=Han}|\p{sc=Katakana}|\p{sc=Hiragana}|\p{sc=Hangul})/gmu;
    const addSpaceAroundChineseJapaneseKoreanAndEnglish = function(
        text: string,
    ): string {
      return text.replace(head, '$1 $3').replace(tail, '$1 $3');
    };

    let newText = ignoreListOfTypes(
        [
          IgnoreTypes.code,
          IgnoreTypes.inlineCode,
          IgnoreTypes.yaml,
          IgnoreTypes.image,
          IgnoreTypes.link,
          IgnoreTypes.wikiLink,
          IgnoreTypes.tag,
          IgnoreTypes.italics,
          IgnoreTypes.bold,
          IgnoreTypes.math,
          IgnoreTypes.inlineMath,
        ],
        text,
        addSpaceAroundChineseJapaneseKoreanAndEnglish,
    );

    newText = updateItalicsText(
        newText,
        addSpaceAroundChineseJapaneseKoreanAndEnglish,
    );

    newText = updateBoldText(
        newText,
        addSpaceAroundChineseJapaneseKoreanAndEnglish,
    );

    return newText;
  }
  get exampleBuilders(): ExampleBuilder<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Space between Chinese and English',
        before: dedent`
          中文字符串english中文字符串。
        `,
        after: dedent`
          中文字符串 english 中文字符串。
        `,
      }),
      new ExampleBuilder({
        description: 'Space between Chinese and link',
        before: dedent`
          中文字符串[english](http://example.com)中文字符串。
        `,
        after: dedent`
          中文字符串 [english](http://example.com) 中文字符串。
        `,
      }),
      new ExampleBuilder({
        description: 'Space between Chinese and inline code block',
        before: dedent`
          中文字符串\`code\`中文字符串。
        `,
        after: dedent`
          中文字符串 \`code\` 中文字符串。
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/234
        description: 'No space between Chinese and English in tag',
        before: dedent`
          #标签A #标签2标签
        `,
        after: dedent`
          #标签A #标签2标签
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/301
        description:
          'Make sure that spaces are not added between italics and chinese characters to preserve markdown syntax',
        before: dedent`
          _这是一个数学公式_
          *这是一个数学公式english*
          ${''}
          # Handling bold and italics nested in each other is not supported at this time
          ${''}
          **_这是一_个数学公式**
          *这是一hello__个数学world公式__*
        `,
        after: dedent`
          _这是一个数学公式_
          *这是一个数学公式 english*
          ${''}
          # Handling bold and italics nested in each other is not supported at this time
          ${''}
          **_ 这是一 _ 个数学公式**
          *这是一 hello__ 个数学 world 公式 __*
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/302
        description: 'Images and links are ignored',
        before: dedent`
          [[这是一个数学公式english]]
          ![[这是一个数学公式english.jpg]]
          [这是一个数学公式english](这是一个数学公式english.md)
          ![这是一个数学公式english](这是一个数学公式english.jpg)
        `,
        after: dedent`
          [[这是一个数学公式english]]
          ![[这是一个数学公式english.jpg]]
          [这是一个数学公式english](这是一个数学公式english.md)
          ![这是一个数学公式english](这是一个数学公式english.jpg)
        `,
      }),
      new ExampleBuilder({
        description: 'Space between CJK and English',
        before: dedent`
          日本語englishひらがな
          カタカナenglishカタカナ
          ﾊﾝｶｸｶﾀｶﾅenglish１２３全角数字
          한글english한글
        `,
        after: dedent`
          日本語 english ひらがな
          カタカナ english カタカナ
          ﾊﾝｶｸｶﾀｶﾅ english１２３全角数字
          한글 english 한글
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions>[] {
    return [];
  }
}
