import {graphql} from 'graphql';
import test from 'tape';
import {schema} from './schema';

test('GraphQLEmail', t => {
  const invalid = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email.@example.com',
    'email..email@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@example..com',
    'Abc..123@example.com'
  ];

  const valid = [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@123.123.123.123',
    '“email”@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of invalid) {
    const query = '{email(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid address recognized as valid: ' + item);
      })
      .catch(error => {
        t.equal(error.message, 'Query error: Not a valid Email address', 'invalid address recognized');
      });
  }

  for (const item of valid) {
    const query = '{email(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.email) {
          t.equal(result.data.email, item, 'valid address recognized');
        }
        else {
          t.fail('valid address recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }
});

test('GraphQLURL', t => {
  const valid = [
    'http://foo.com/blah_blah',
    'http://foo.com/blah_blah/',
    'http://foo.com/blah_blah_(wikipedia)',
    'http://foo.com/blah_blah_(wikipedia)_(again)',
    'http://www.example.com/wpstyle/?p=364',
    'https://www.example.com/foo/?bar=baz&inga=42&quux',
    'http://✪df.ws/123',
    'http://userid:password@example.com:8080',
    'http://userid:password@example.com:8080/',
    'http://userid@example.com',
    'http://userid@example.com/',
    'http://userid@example.com:8080',
    'http://userid@example.com:8080/',
    'http://userid:password@example.com',
    'http://userid:password@example.com/',
    'http://142.42.1.1/',
    'http://142.42.1.1:8080/',
    'http://➡.ws/䨹',
    'http://⌘.ws',
    'http://⌘.ws/',
    'http://foo.com/blah_(wikipedia)#cite-1',
    'http://foo.com/blah_(wikipedia)_blah#cite-1',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://foo.com/(something)?after=parens',
    'http://☺.damowmow.com/',
    'http://code.google.com/events/#&product=browser',
    'http://j.mp',
    'ftp://foo.bar/baz',
    'http://foo.bar/?q=Test%20URL-encoded%20stuff',
    'http://مثال.إختبار',
    'http://例子.测试',
    'http://उदाहरण.परीक्षा',
    'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com',
    'http://1337.net',
    'http://a.b-c.de',
    'http://223.255.255.254'
  ];

  const invalid = [
    'http://',
    'http://.',
    'http://..',
    'http://../',
    'http://?',
    'http://??',
    'http://??/',
    'http://#',
    'http://##',
    'http://##/',
    'http://foo.bar?q=Spaces should be encoded',
    '//',
    '//a',
    '///a',
    '///',
    'http:///a',
    'foo.com',
    'rdar://1234',
    'h://test',
    'http:// shouldfail.com',
    ':// should fail',
    'http://foo.bar/foo(bar)baz quux',
    'ftps://foo.bar/',
    'http://-error-.invalid/',
    'http://-a.b.co',
    'http://a.b-.co',
    'http://0.0.0.0',
    'http://10.1.1.0',
    'http://10.1.1.255',
    'http://224.1.1.1',
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
    'http://.www.foo.bar/',
    'http://.www.foo.bar./',
    'http://10.1.1.1'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{url(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.url) {
          t.equal(result.data.url, item, 'valid URL recognized');
        }
        else {
          t.fail('valid URL recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{url(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid URL recognized as valid: ' + item);
      })
      .catch(error => {
        t.equal(error.message, 'Query error: Not a valid URL', 'invalid URL recognized');
      });
  }
});

test('GraphQLLimitedString (default)', t => {
  const valid = [
    'a',
    'aa',
    'aaa1',
    '1aaa'
  ];

  const invalid = [''];
  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{limitedStringDefault(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.limitedStringDefault) {
          t.equal(result.data.limitedStringDefault, item, 'valid LimitedString recognized');
        }
        else {
          t.fail('valid LimitedString recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{limitedStringDefault(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid LimitedString recognized as valid: ' + item);
      })
      .catch(error => {
        t.equal(error.message, 'Query error: String not long enough', 'invalid LimitedString recognized');
      });
  }
});

test('GraphQLLimitedString (min = 3, max = 10)', t => {
  const valid = [
    'foo',
    'foobar',
    'foo-bar',
    'foobar23',
    '123456789'
  ];

  const invalid = [
    '',
    'a',
    'aa',
    '01234567890',
    'foobar23456'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{limitedStringMinMax(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.limitedStringMinMax) {
          t.equal(result.data.limitedStringMinMax, item, 'valid LimitedString recognized');
        }
        else {
          t.fail('valid LimitedString recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{limitedStringMinMax(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid LimitedString recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid LimitedString recognized');
      });
  }
});

test('GraphQLLimitedString (min = 3, max = 10, alphabet = "abc123")', t => {
  const valid = [
    'aaa',
    'abc',
    'abc123',
    '1231231231',
    'aaaaabbbbb',
    '33333ccc22'
  ];

  const invalid = [
    '',
    'a',
    'aa',
    'dddd',
    'abd1234',
    '01234567890',
    'foobar23456'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{limitedStringAlphabet(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.limitedStringAlphabet) {
          t.equal(result.data.limitedStringAlphabet, item, 'valid LimitedString recognized');
        }
        else {
          t.fail('valid LimitedString recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{limitedStringAlphabet(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid LimitedString recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid LimitedString recognized');
      });
  }
});

test('GraphQLPassword (alphaNumeric)', t => {
  const valid = [
    'a1',
    'a1c',
    'abc123',
    '123abc1231',
    '33333ccc22',
    '33333ccc22C',
    '333§ccc22'
  ];

  const invalid = [
    '',
    'a',
    'aa',
    'dddd',
    'aaaaabbbbb',
    '1',
    '1234',
    '1234567890'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{password(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.password) {
          t.equal(result.data.password, item, 'valid Password recognized');
        }
        else {
          t.fail('valid Password recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{password(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid Password recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid Password recognized');
      });
  }
});

test('GraphQLPassword (mixedCase)', t => {
  const valid = [
    'aA',
    'a1C',
    'aBc123',
    '123Abc1231',
    '33333cCc22',
    '33333ccc22C',
    '333§ccC22'
  ];

  const invalid = [
    '',
    'a',
    'aa',
    'dddd',
    'aaaaabbbbb',
    '1',
    '1234',
    '1234567890',
    '1a',
    '123aaaa',
    'foo23bar'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{passwordMixedCase(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.passwordMixedCase) {
          t.equal(result.data.passwordMixedCase, item, 'valid Password recognized');
        }
        else {
          t.fail('valid Password recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{passwordMixedCase(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid Password recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid Password recognized');
      });
  }
});

test('GraphQLPassword (specialChars)', t => {
  const valid = [
    'aÄ',
    'a1*',
    'a(c123',
    '1%3Abc1231',
    '33333#Cc22',
    '!1',
    '!#!§$%&/()'
  ];

  const invalid = [
    '',
    'a',
    'aa',
    'dddd',
    'aaaaabbbbb',
    '1',
    '1234',
    '1234567890',
    '1a',
    '123aaaa',
    'foo23bar'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{passwordSpecialChars(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.passwordSpecialChars) {
          t.equal(result.data.passwordSpecialChars, item, 'valid Password recognized');
        }
        else {
          t.fail('valid Password recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{passwordSpecialChars(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid Password recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid Password recognized');
      });
  }
});

test('GraphQLPassword (all)', t => {
  const valid = [
    'a1!B',
    'b2§A3!',
    '!!A1b'
  ];

  const invalid = [
    '',
    'a',
    'aa',
    'dddd',
    'aaaaabbbbb',
    '1',
    '1234',
    '1234567890',
    '1a',
    '123aaaa',
    'foo23bar',
    'aÄ',
    'a1*',
    'a(c123',
    '1%3Abc1231',
    '33333#Cc22',
    '!1'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{passwordAll(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.passwordAll) {
          t.equal(result.data.passwordAll, item, 'valid Password recognized');
        }
        else {
          t.fail('valid Password recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{passwordAll(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid Password recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid Password recognized');
      });
  }
});

test('GraphQLDateTime', t => {
  const valid = [
    '2015',
    '9999',
    '123456',
    '2015-1',
    '2015-1-1',
    '2015-5-31',
    '2015-01-01',
    '2015-05-31',
    '2015-05-31T14:23',
    '2015-05-31T14:23:30',
    '2015-05-31T14:23:30.1234',
    '2015-05-31T14:23Z',
    '2015-05-31T14:23:30.1234Z',
    '2015-05-31T14:23:30.1234+05:00',
    '1970-01-01T00:00:00.000Z',
    '1969-12-31T23:59:59.999Z'
  ];

  const invalid = [
    '2015-13-1',
    '2015-01-01T23:61:59',
    '2015-05-31T14:63:30'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{date(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.date) {
          t.equal(result.data.date, item, 'valid DateTime recognized');
        }
        else {
          t.fail('valid Password recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{date(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid DateTime recognized as valid: ' + item);
      })
      .catch(error => {
        t.ok(error.message, 'invalid DateTime recognized');
      });
  }
});


test('GraphQLUUID', t => {
  const valid = [
    'bfaa2768-ba8c-11e5-9912-ba0be0483c18',
    'E8D6F4C2-BA8C-11E5-9912-BA0BE0483C18',
    'bd2e3ee3-8908-4665-9b59-682587236654',
    'df7c8034-41e3-409a-a441-2e08ba65b827',
    '5a028adb-c082-4980-aab3-f3c16642281a',
    '6715da1d-212b-4aab-9b9e-117e3a10de19',
    '209a03b9-2d18-4ea1-ab11-c3d46e7f1725',
    'f1b2eddc-4d38-42b1-8232-137934b6821d',
    '874ed1b5-51e6-470f-8b29-b21ade28cb81',
    '13627f16-6b28-4a91-bdc0-15bd9387b9ed',
    '738442a4-00e6-43b6-b6d5-f9a8e8aa3528',
    'b27fbc79-1314-472c-b509-2feb9d0050f7',
    '6ea45d93-9d50-4668-9ccb-07ab78b14458',
    'f97f6df2-f94b-47a1-a2db-ea2802ef79d9',
    '019fad9a-fbae-4dd6-aba2-3d76bdcaed59'
  ];

  const invalid = [
    '',
    'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
    'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
    'A987FBC94BED3078CF079141BA07C9F3',
    '934859',
    '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
    'AAAAAAAA-1111-1111-AAAG-111111111111'
  ];

  t.plan(valid.length + invalid.length);

  for (const item of valid) {
    const query = '{uuid(item: "' + item + '")}';
    graphql(schema, query)
      .then(result => {
        if (result.data && result.data.uuid) {
          t.equal(result.data.uuid, item, 'valid UUID recognized');
        }
        else {
          t.fail('valid UUID recognized as invalid: ' + item);
        }
      })
      .catch(error => {
        t.fail(error);
      });
  }

  for (const item of invalid) {
    const query = '{uuid(item: "' + item + '")}';
    graphql(schema, query)
      .then(() => {
        t.fail('invalid UUID recognized as valid: ' + item);
      })
      .catch(error => {
        t.equal(error.message, 'Query error: Not a valid UUID', 'invalid UUID recognized');
      });
  }
});
