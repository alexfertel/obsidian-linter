import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {convertAliasValueToStringOrStringArray, escapeStringIfNecessaryAndPossible, formatYamlArrayValue, getYamlSectionValue, initYAML, LINTER_ALIASES_HELPER_KEY, loadYAML, NormalArrayFormats, OBSIDIAN_ALIASES_KEYS, OBSIDIAN_ALIAS_KEY_PLURAL, removeYamlSection, setYamlSection, SpecialArrayFormats, splitValueIfSingleOrMultilineArray} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {getFirstHeaderOneText, yamlRegex} from '../utils/regex';


class YamlTitleAliasOptions implements Options {
  preserveExistingAliasesSectionStyle?: boolean = true;
  keepAliasThatMatchesTheFilename?: boolean = false;
  useYamlKeyToKeepTrackOfOldFilenameOrHeading?: boolean = true;

  @RuleBuilder.noSettingControl()
    aliasArrayStyle?: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.MultiLine;

  @RuleBuilder.noSettingControl()
    fileName?: string;

  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: string = '"';
}

@RuleBuilder.register
export default class YamlTitleAlias extends RuleBuilder<YamlTitleAliasOptions> {
  get OptionsClass(): new () => YamlTitleAliasOptions {
    return YamlTitleAliasOptions;
  }
  get name(): string {
    return 'YAML Title Alias';
  }
  get description(): string {
    return 'Inserts the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: YamlTitleAliasOptions): string {
    text = initYAML(text);
    let title = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.tag], text, getFirstHeaderOneText);
    title = title || options.fileName;

    let previousTitle: string = null;
    const yaml = text.match(yamlRegex)[1];

    const shouldRemoveTitleAlias = !options.keepAliasThatMatchesTheFilename && title === options.fileName;
    if (options.useYamlKeyToKeepTrackOfOldFilenameOrHeading) {
      previousTitle = loadYAML(getYamlSectionValue(yaml, LINTER_ALIASES_HELPER_KEY));
    }

    let newYaml = yaml.replace('---\n', '').replace('\n---', '');
    const parsedYaml = loadYAML(yaml);

    previousTitle = loadYAML(getYamlSectionValue(yaml, LINTER_ALIASES_HELPER_KEY));

    title = escapeStringIfNecessaryAndPossible(title, options.defaultEscapeCharacter);
    const getNewAliasValue = function(originalValue: string |string[], shouldRemoveTitle: boolean): string |string[] {
      if (originalValue == null) {
        return shouldRemoveTitle ? '' : title;
      }

      if (typeof originalValue === 'string') {
        if (shouldRemoveTitle) {
          if (originalValue === title) {
            originalValue = '';
          }
        } else if (previousTitle === originalValue) {
          originalValue = title;
        } else {
          originalValue = [title, originalValue];
        }
      } else if (previousTitle !== null) {
        const previousTitleIndex = originalValue.indexOf(previousTitle);
        if (previousTitleIndex !== -1) {
          if (shouldRemoveTitle) {
            originalValue.splice(previousTitleIndex, 1);
          } else {
            originalValue[previousTitleIndex] = title;
          }
        }
      } else {
        const currentTitleIndex = originalValue.indexOf(title);
        if (currentTitleIndex !== -1) {
          if (shouldRemoveTitle) {
            originalValue.splice(currentTitleIndex, 1);
          }
        } else if (!shouldRemoveTitle) {
          originalValue = [title, ...originalValue];
        }
      }

      if (originalValue === '' || originalValue.length === 0) {
        return '';
      }

      return originalValue;
    };

    let aliasKeyForFile: string = null;
    const yamlKeys = Object.keys(parsedYaml);
    for (const aliasKey of OBSIDIAN_ALIASES_KEYS) {
      if (yamlKeys.includes(aliasKey)) {
        aliasKeyForFile = aliasKey;

        break;
      }
    }


    if (aliasKeyForFile != null) {
      const aliasesValue = getYamlSectionValue(newYaml, aliasKeyForFile);
      let currentAliasStyle: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.MultiLine;
      const isEmpty = aliasesValue === '';
      let isSingleString = false;
      if (!aliasesValue.includes('\n')) {
        if (aliasesValue.match(/^\[.*\]/) === null) {
          // Note that the value here is just really a placeholder to indicate it is not single-line or multi-line
          currentAliasStyle = SpecialArrayFormats.SingleStringToSingleLine;
          isSingleString = true;
        } else {
          currentAliasStyle = NormalArrayFormats.SingleLine;
        }
      }

      const currentAliasValue = convertAliasValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(aliasesValue));
      const newAliasValue = getNewAliasValue(currentAliasValue, shouldRemoveTitleAlias);

      if (newAliasValue === '') {
        newYaml = removeYamlSection(newYaml, aliasKeyForFile);
      } else if (options.preserveExistingAliasesSectionStyle) {
        if (!isEmpty && ((isSingleString && title == newAliasValue) || !isSingleString || currentAliasValue == newAliasValue)) {
          newYaml = setYamlSection(newYaml, aliasKeyForFile, formatYamlArrayValue(newAliasValue, currentAliasStyle));
        } else {
          newYaml = setYamlSection(newYaml, aliasKeyForFile, formatYamlArrayValue(newAliasValue, options.aliasArrayStyle));
        }
      } else {
        newYaml = setYamlSection(newYaml, aliasKeyForFile, formatYamlArrayValue(newAliasValue, options.aliasArrayStyle));
      }
    } else if (!shouldRemoveTitleAlias) {
      newYaml = setYamlSection(newYaml, OBSIDIAN_ALIAS_KEY_PLURAL, formatYamlArrayValue(title, options.aliasArrayStyle));
    }

    if (!options.useYamlKeyToKeepTrackOfOldFilenameOrHeading || shouldRemoveTitleAlias) {
      newYaml = removeYamlSection(newYaml, LINTER_ALIASES_HELPER_KEY);
    } else {
      newYaml = setYamlSection(newYaml, LINTER_ALIASES_HELPER_KEY, ` ${title}`);
    }

    text = text.replace(`---\n${yaml}---\n`, `---\n${newYaml}---\n`);

    return text;
  }
  get exampleBuilders(): ExampleBuilder<YamlTitleAliasOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Adds a header with the title from heading.',
        before: dedent`
          # Obsidian
        `,
        after: dedent`
          ---
          aliases:
            - Obsidian
          linter-yaml-title-alias: Obsidian
          ---
          # Obsidian
        `,
      }),
      new ExampleBuilder({
        description: 'Adds a header with the title from heading without YAML key when the use of the YAML key is set to false.',
        before: dedent`
          # Obsidian
        `,
        after: dedent`
          ---
          aliases:
            - Obsidian
          ---
          # Obsidian
        `,
        options: {
          useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
        },
      }),
      new ExampleBuilder({
        description: 'Adds a header with the title.',
        before: dedent`
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
          linter-yaml-title-alias: Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
        },
      }),
      new ExampleBuilder({
        description: 'Adds a header with the title without YAML key when the use of the YAML key is set to false.',
        before: dedent`
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
          useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
        },
      }),
      new ExampleBuilder({
        description: 'Replaces old filename with new filename when no header is present and filename is different than the old one listed in `linter-yaml-title-alias`.',
        before: dedent`
          ---
          aliases:
            - Old Filename
            - Alias 2
          linter-yaml-title-alias: Old Filename
          ---
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
            - Alias 2
          linter-yaml-title-alias: Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
        },
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/470
        description: 'Make sure that markdown and wiki links in first H1 get their values converted to text',
        before: dedent`
          # This is a [Heading](markdown.md)
        `,
        after: dedent`
          ---
          aliases:
            - This is a Heading
          linter-yaml-title-alias: This is a Heading
          ---
          # This is a [Heading](markdown.md)
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      },
      ),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTitleAliasOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        name: 'Preserve existing aliases section style',
        description: 'If set, the `YAML aliases section style` setting applies only to the newly created sections',
        optionsKey: 'preserveExistingAliasesSectionStyle',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        name: 'Keep alias that matches the filename',
        description: 'Such aliases are usually redundant',
        optionsKey: 'keepAliasThatMatchesTheFilename',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        name: 'Use the YAML key `linter-yaml-title-alias` to help with filename and heading changes',
        description: 'If set, when the first H1 heading changes or filename if first H1 is not present changes, then the old alias stored in this key will be replaced with the new value instead of just inserting a new entry in the aliases array',
        optionsKey: 'useYamlKeyToKeepTrackOfOldFilenameOrHeading',
      }),
    ];
  }
}
