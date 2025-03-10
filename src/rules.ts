import {
  getYamlSectionValue,
  loadYAML,
} from './utils/yaml';
import {
  Option,
  BooleanOption,
} from './option';
import {yamlRegex} from './utils/regex';
import {YAMLException} from 'js-yaml';
import {LinterError} from './linter-error';
import {
  NormalArrayFormats,
  SpecialArrayFormats,
  TagSpecificArrayFormats,
} from './utils/yaml';
import {LintCommand} from './ui/linter-components/custom-command-option';
import {CustomReplace} from './ui/linter-components/custom-replace-option';

// CommonStyles are settings that are used in multiple places and thus need to be external to rules themselves to help facilitate their use
export type CommonStyles = {
  aliasArrayStyle: NormalArrayFormats | SpecialArrayFormats;
  tagArrayStyle: TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats;
  minimumNumberOfDollarSignsToBeAMathBlock: number;
  escapeCharacter: string;
}

export type Options = { [optionName: string]: any};

type ApplyFunction = (text: string, options?: Options) => string;

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
  displayChanged: boolean;
  foldersToIgnore: string[];
  linterLocale: string;
  logLevel: number;
  lintCommands: LintCommand[];
  customRegexes: CustomReplace[];
  commonStyles: CommonStyles;
}

export enum RuleType {
  YAML = 'YAML',
  HEADING = 'Heading',
  FOOTNOTE = 'Footnote',
  CONTENT = 'Content',
  SPACING = 'Spacing',
  PASTE = 'Paste',
}

/** Class representing a rule */
export class Rule {
  public name: string;
  public description: string;
  public type: RuleType;
  public options: Array<Option>;
  public apply: ApplyFunction;

  public examples: Array<Example>;
  public readonly hasSpecialExecutionOrder: boolean;

  /**
   * Create a rule
   * @param {string} name - The name of the rule
   * @param {string} description - The description of the rule
   * @param {RuleType} type - The type of the rule
   * @param {ApplyFunction} apply - The function to apply the rule
   * @param {Array<Example>} examples - The examples to be displayed in the documentation
   * @param {Array<Option>} [options=[]] - The options of the rule to be displayed in the documentation
   * @param {boolean} [hasSpecialExecutionOrder=false] - The rule has special execution order
   */
  constructor(
      name: string,
      description: string,
      type: RuleType,
      apply: ApplyFunction,
      examples: Array<Example>,
      options: Array<Option> = [],
      hasSpecialExecutionOrder: boolean = false,
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.apply = apply;
    this.examples = examples;

    options.unshift(new BooleanOption(this.description, '', false));
    for (const option of options) {
      option.ruleName = name;
    }
    this.options = options;
    this.hasSpecialExecutionOrder = hasSpecialExecutionOrder;
  }

  public alias(): string {
    return this.name.replace(/ /g, '-').toLowerCase();
  }

  public getDefaultOptions() {
    const options: { [optionName: string]: any } = {};

    for (const option of this.options) {
      options[option.name] = option.defaultValue;
    }

    return options;
  }

  public getOptions(settings: LinterSettings) {
    return settings.ruleConfigs[this.name];
  }

  public getURL(): string {
    const url =
      'https://github.com/platers/obsidian-linter/blob/master/docs/rules.md';
    return url + '#' + this.alias();
  }

  public enabledOptionName(): string {
    return this.options[0].name;
  }
}

/** Class representing an example of a rule */
export class Example {
  public description: string;
  public options: Options;

  public before: string;
  public after: string;

  /**
   * Create an example
   * @param {string} description - The description of the example
   * @param {string} before - The text before the rule is applied
   * @param {string} after - The text after the rule is applied
   * @param {object} options - The options of the example
   */
  constructor(
      description: string,
      before: string,
      after: string,
      options: Options = {},
  ) {
    this.description = description;
    this.options = options;
    this.before = before;
    this.after = after;
  }
}

export const RuleTypeOrder = Object.values(RuleType);

/**
 * Returns a list of ignored rules in the YAML frontmatter of the text.
 * @param {string} text The text to parse
 * @return {string[]} The list of ignored rules
 */
export function getDisabledRules(text: string): string[] {
  const yaml = text.match(yamlRegex);
  if (!yaml) {
    return [];
  }

  const yaml_text = yaml[1];
  const disabledRulesValue = getYamlSectionValue(yaml_text, 'disabled rules');
  if (disabledRulesValue == null) {
    return [];
  }

  let disabledRulesKeyAndValue = disabledRulesValue.includes('\n') ? 'disabled rules:\n' : 'disabled rules: ';
  disabledRulesKeyAndValue += disabledRulesValue;

  const parsed_yaml = loadYAML(disabledRulesKeyAndValue);
  let disabled_rules = (parsed_yaml as { 'disabled rules': string[] | string })[
      'disabled rules'
  ];
  if (!disabled_rules) {
    return [];
  }

  if (typeof disabled_rules === 'string') {
    disabled_rules = [disabled_rules];
  }

  if (disabled_rules.includes('all')) {
    return rules.map((rule) => rule.alias());
  }

  return disabled_rules;
}

export const rules: Rule[] = [];

export const rulesDict = rules.reduce(
    (dict, rule) => ((dict[rule.alias()] = rule), dict),
  {} as Record<string, Rule>,
);

export function registerRule(rule: Rule): void {
  rules.push(rule);
  rules.sort((a, b) => (RuleTypeOrder.indexOf(a.type) - RuleTypeOrder.indexOf(b.type)) || (a.name.localeCompare(b.name)));
  rulesDict[rule.alias()] = rule;
}

export function wrapLintError(error: Error, ruleName: string) {
  let errorMessage: string;
  if (error instanceof YAMLException) {
    errorMessage = error.toString();
    errorMessage =`error in the yaml: ${errorMessage.substring(errorMessage.indexOf(':') + 1)}`;
  } else {
    errorMessage = `unknown error: ${error.message}`;
  }

  throw new LinterError(`"${ruleName}" encountered an ${errorMessage}`, error);
}
