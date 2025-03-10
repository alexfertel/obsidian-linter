import NoBareUrls from '../src/rules/no-bare-urls';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: NoBareUrls,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/275
      testName: 'Leaves markdown links and images alone',
      before: dedent`
        [regular link](https://google.com)
        ![image alt text](https://github.com/favicon.ico)
      `,
      after: dedent`
        [regular link](https://google.com)
        ![image alt text](https://github.com/favicon.ico)
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/339
      testName: 'Urls with a hashtag referring to header that are surrounded by `<` and `> should be left alone',
      before: dedent`
        <https://google.com#hashtag>
      `,
      after: dedent`
        <https://google.com#hashtag>
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/469
      testName: 'Urls that are surrounded by smart quotes should be left alone',
      before: dedent`
        “https://google.com”
        ‘https://google.com’
      `,
      after: dedent`
        “https://google.com”
        ‘https://google.com’
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/469
      testName: 'Urls that are in inline code should be left alone',
      before: dedent`
        \`http --headers --follow --all https://google.com\`
      `,
      after: dedent`
        \`http --headers --follow --all https://google.com\`
      `,
    },
  ],
});
