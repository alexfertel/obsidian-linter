import YamlTitleAlias from '../src/rules/yaml-title-alias';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {NormalArrayFormats, SpecialArrayFormats} from '../src/utils/yaml';

ruleTest({
  RuleBuilderClass: YamlTitleAlias,
  testCases: [
    {
      testName: 'Creates multi-line array aliases when missing',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Creates multi-line array aliases when missing without helper key',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
        ---
        # Title
      `,
      options: {
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Creates single-line array aliases when missing',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.SingleLine,
      },
    },
    {
      testName: 'Creates single-line array aliases when missing without helper key',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title]
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.SingleLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Creates single string alias when missing',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    {
      testName: 'Creates single string alias when missing without helper key',
      before: dedent`
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Creates multi-line array aliases when empty',
      before: dedent`
        ---
        aliases: ${''}
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Creates multi-line array aliases when empty without helper key',
      before: dedent`
        ---
        aliases: ${''}
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
        ---
        # Title
      `,
      options: {
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Creates single-line array aliases when empty',
      before: dedent`
        ---
        aliases: ${''}
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.SingleLine,
      },
    },
    {
      testName: 'Creates single-line array aliases when empty without helper key',
      before: dedent`
        ---
        aliases: ${''}
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title]
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.SingleLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Creates single string alias when empty',
      before: dedent`
        ---
        aliases: ${''}
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    {
      testName: 'Creates single string alias when empty without helper key',
      before: dedent`
        ---
        aliases: ${''}
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Updates first alias in multi-line array',
      before: dedent`
        ---
        aliases:
          - alias1
          - alias2
          - alias3
        linter-yaml-title-alias: alias1
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
          - alias2
          - alias3
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Adds new value as first alias in multi-line array when there is no helper key and it is not on',
      before: dedent`
        ---
        aliases:
          - alias1
          - alias2
          - alias3
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
          - alias1
          - alias2
          - alias3
        ---
        # Title
      `,
      options: {
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Adds before first alias in multi-line array',
      before: dedent`
        ---
        aliases:
          - alias1
          - alias2
          - alias3
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
          - alias1
          - alias2
          - alias3
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Updates first alias in single-line array',
      before: dedent`
        ---
        aliases: [alias1, alias2, alias3]
        linter-yaml-title-alias: alias1
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title, alias2, alias3]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Adds before first alias in single-line array',
      before: dedent`
        ---
        aliases: [alias1, alias2, alias3]
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title, alias1, alias2, alias3]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Adds before first alias in single-line array without helper key',
      before: dedent`
        ---
        aliases: [alias1, alias2, alias3]
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title, alias1, alias2, alias3]
        ---
        # Title
      `,
      options: {
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Updates single string alias',
      before: dedent`
        ---
        aliases: other alias
        linter-yaml-title-alias: other alias
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Changes single string aliases to multi-line array when adding',
      before: dedent`
        ---
        aliases: other alias
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
          - other alias
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    {
      testName: 'Changes single string aliases to multi-line array when adding without helper key',
      before: dedent`
        ---
        aliases: other alias
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
          - other alias
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Changes single string aliases to single-line array when adding',
      before: dedent`
        ---
        aliases: other alias
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title, other alias]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
      },
    },
    {
      testName: 'Changes single string aliases to single-line array when adding without helper key',
      before: dedent`
        ---
        aliases: other alias
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title, other alias]
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Titles with special a colon and then a space are escaped',
      before: dedent`
        # Title with: colon
      `,
      after: dedent`
        ---
        aliases:
          - 'Title with: colon'
        linter-yaml-title-alias: 'Title with: colon'
        ---
        # Title with: colon
      `,
      options: {
        defaultEscapeCharacter: '\'',
      },
    },
    {
      testName: 'Titles with double quote are escaped',
      before: dedent`
        # Title with "double quote"
      `,
      after: dedent`
        ---
        aliases:
          - 'Title with "double quote"'
        linter-yaml-title-alias: 'Title with "double quote"'
        ---
        # Title with "double quote"
      `,
    },
    {
      testName: 'Titles with single quote are escaped',
      before: dedent`
        # Title with 'single quote'
      `,
      after: dedent`
        ---
        aliases:
          - "Title with 'single quote'"
        linter-yaml-title-alias: "Title with 'single quote'"
        ---
        # Title with 'single quote'
      `,
    },
    {
      testName: 'Position of existing non-empty aliases section is preserved',
      before: dedent`
        ---
        key1: value1
        key2: value2
        aliases:
          - alias1
          - alias2
          - alias3
        key3: value3
        ---
        # Title
      `,
      after: dedent`
        ---
        key1: value1
        key2: value2
        aliases:
          - Title
          - alias1
          - alias2
          - alias3
        key3: value3
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Position of existing empty aliases section is preserved',
      before: dedent`
        ---
        key1: value1
        key2: value2
        aliases: ${''}
        key3: value3
        ---
        # Title
      `,
      after: dedent`
        ---
        key1: value1
        key2: value2
        aliases:
          - Title
        key3: value3
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
    },
    {
      testName: 'Does not add alias that matches the filename for multi-line array style aliases section',
      before: dedent`
        ---
        aliases:
          - alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - alias1
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    {
      testName: 'Does not add alias that matches the filename for single-line array style aliases section',
      before: dedent`
        ---
        aliases: [alias1]
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: [alias1]
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    {
      testName: 'Does not add alias that matches the filename for single string style aliases section',
      before: dedent`
        ---
        aliases: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: alias1
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    {
      testName: 'Does not add alias that matches the filename for multi-line array style aliases section, removes previous alias',
      before: dedent`
        ---
        aliases:
          - alias1
          - alias2
        linter-yaml-title-alias: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - alias2
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    {
      testName: 'Does not add alias that matches the filename for single-line array style aliases section, removes previous alias',
      before: dedent`
        ---
        aliases: [alias1, alias2]
        linter-yaml-title-alias: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: [alias2]
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    {
      testName: 'Does not add alias that matches the filename for single string style aliases section, removes previous alias',
      before: dedent`
        ---
        aliases: alias1
        linter-yaml-title-alias: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    {
      testName: 'Adds alias that matches the filename for multi-line array style aliases section',
      before: dedent`
        ---
        aliases:
          - alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - Filename
          - alias1
        linter-yaml-title-alias: Filename
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
      },
    },
    {
      testName: 'Adds alias that matches the filename for multi-line array style aliases section without helper key',
      before: dedent`
        ---
        aliases:
          - alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - Filename
          - alias1
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Adds alias that matches the filename for single-line array style aliases section',
      before: dedent`
        ---
        aliases: [alias1]
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: [Filename, alias1]
        linter-yaml-title-alias: Filename
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
      },
    },
    {
      testName: 'Adds alias that matches the filename for single-line array style aliases section without helper key',
      before: dedent`
        ---
        aliases: [alias1]
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: [Filename, alias1]
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Adds alias that matches the filename for single string style aliases section',
      before: dedent`
        ---
        aliases: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - Filename
          - alias1
        linter-yaml-title-alias: Filename
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    {
      testName: 'Adds alias that matches the filename for single string style aliases section',
      before: dedent`
        ---
        aliases: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - Filename
          - alias1
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
    {
      testName: 'Replaces alias that matches the filename for multi-line array style aliases section',
      before: dedent`
        ---
        aliases:
          - alias1
          - alias2
        linter-yaml-title-alias: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases:
          - Filename
          - alias2
        linter-yaml-title-alias: Filename
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
      },
    },
    {
      testName: 'Replaces alias that matches the filename for single-line array style aliases section',
      before: dedent`
        ---
        aliases: [alias1, alias2]
        linter-yaml-title-alias: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: [Filename, alias2]
        linter-yaml-title-alias: Filename
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
      },
    },
    {
      testName: 'Replaces alias that matches the filename for single string style aliases section, removes previous alias',
      before: dedent`
        ---
        aliases: alias1
        linter-yaml-title-alias: alias1
        ---
        # Filename
      `,
      after: dedent`
        ---
        aliases: Filename
        linter-yaml-title-alias: Filename
        ---
        # Filename
      `,
      options: {
        keepAliasThatMatchesTheFilename: true,
        fileName: 'Filename',
      },
    },
    {
      testName: 'Dollar sign $ is handled properly',
      before: dedent`
        # Dollar $
      `,
      after: dedent`
        ---
        aliases:
          - Dollar $
        linter-yaml-title-alias: Dollar $
        ---
        # Dollar $
      `,
    },
    {
      testName: 'Converts from single-line array to multi-line array',
      before: dedent`
        ---
        aliases: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.MultiLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from single-line array to multi-line array for single string style setting',
      before: dedent`
        ---
        aliases: [Title, alias2]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
          - alias2
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from single string to multi-line array',
      before: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases:
          - Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.MultiLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from multi-line array to single-line array',
      before: dedent`
        ---
        aliases:
          - Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.SingleLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from multi-line array to single-line array for single string style setting',
      before: dedent`
        ---
        aliases:
          - Title
          - alias2
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title, alias2]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from single string to single-line array',
      before: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.SingleLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from multi-line array to single string',
      before: dedent`
        ---
        aliases:
          - Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Converts from single-line array to single string',
      before: dedent`
        ---
        aliases: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        aliases: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/441
      testName: 'Converts from single-line array to single string for key `alias`',
      before: dedent`
        ---
        alias: [Title]
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      after: dedent`
        ---
        alias: Title
        linter-yaml-title-alias: Title
        ---
        # Title
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        preserveExistingAliasesSectionStyle: false,
      },
    },
    {
      testName: 'Removes empty alias section if title matches the filename',
      before: dedent`
        ---
        aliases:
        ---
        # Filename
      `,
      after: dedent`
        ---
        ---
        # Filename
      `,
      options: {
        fileName: 'Filename',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/449
      testName: 'Make sure that links in headings are properly copied to the yaml when there is a link prior to the first H1',
      before: dedent`
        [[Link1]]

        # [[Heading]]
      `,
      after: dedent`
        ---
        aliases:
          - Heading
        linter-yaml-title-alias: Heading
        ---
        [[Link1]]

        # [[Heading]]
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/470
      testName: 'Make sure that markdown links aliases and custom key are converted to text',
      before: dedent`
        ---
        aliases:
          - This is a [Heading](markdown.md)
        linter-yaml-title-alias: This is a [Heading](markdown.md)
        ---
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
    { // relates to https://github.com/platers/obsidian-linter/issues/470
      testName: 'Make sure that wiki links aliases and custom key are converted to text',
      before: dedent`
        ---
        aliases:
          - This is a [[Heading]]
        linter-yaml-title-alias: This is a [[Heading]]
        ---
        # This is a [[Heading]]
      `,
      after: dedent`
        ---
        aliases:
          - This is a Heading
        linter-yaml-title-alias: This is a Heading
        ---
        # This is a [[Heading]]
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/439
      testName: 'Make sure escaped aliases that match the H1 do not get added back',
      before: dedent`
        ---
        aliases:
          - "It's strange"
        ---
        # It's strange
      `,
      after: dedent`
        ---
        aliases:
          - "It's strange"
        ---
        # It's strange
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.MultiLine,
        useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
      },
    },
  ],
});
