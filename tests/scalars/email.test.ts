import {graphql} from 'graphql';
import {schema} from '../schema';

describe('GraphQLEmail', () => {
	const invalid = [
		'',
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
		'Abc..123@example.com',
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
		'firstname-lastname@example.com',
	];

	invalid.forEach((email) => {
		it(`fails for "${email}"`, async () => {
			const query = `{email(item: "${email}")}`;
			const result = await graphql(schema, query);
			expect(result).not.toHaveProperty('data.email');
			expect(result).toHaveProperty('errors.0.message', expect.stringMatching('Expected type Email, found "[^"]*".'));
		});
	});

	valid.forEach((email) => {
		it(`succeeds for "${email}"`, async () => {
			const query = `{email(item: "${email}")}`;
			const result = await graphql(schema, query);
			expect(result).toHaveProperty('data.email', email);
			expect(result).not.toHaveProperty('errors');
		});
	});

	it('succeeds for NULL', async () => {
		const query = '{email(item: null)}';
		const result = await graphql(schema, query);
		expect(result).toHaveProperty('data.email', null);
		expect(result).not.toHaveProperty('errors');
	});
});
