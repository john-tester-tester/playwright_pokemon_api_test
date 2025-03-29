import { test, expect } from '@playwright/test';
import {Utility} from '../utility/utility_functions';

test.describe('Check pokemon API methods', () => {
  const baseUrl = 'https://pokeapi.co/api/v2';
  const goodResponse: number = 200;
  const errorResponse: number = 404;
  let utility:Utility;
  utility = new Utility();

  test('Check the content and the number of api methods available', async ({ request }) => {
    const expectedAPIResultFile: string = '../expected_API_Results.txt'; // Path to the expected result file
    const expectedNumberOfResults: number = 48;
    const response = await request.get(`${baseUrl}`);
    expect(response.status()).toBe(goodResponse);

    const responseBody: any = await utility.convert_response_to_JSON(await response.text());

    await utility.check_json_response_matches_expected_file(responseBody,
                                                            expectedAPIResultFile,
                                                            expectedNumberOfResults,
                                                            );  

    });

    test('Check an invalid rest api request returns an error', async ({ request }) => {
      const invalidAPIrequest: string = '/test';
      const response = await request.get(`${baseUrl + invalidAPIrequest}`);
      expect(response.status()).toBe(errorResponse);
    });

    test('Check a popular pokemon character, Charizard, can be retrieved', async ({ request }) => {
      const charizardAPIrequest: string = '/pokemon/charizard';
      const expectedKeyValues = new Map<string, string>([["base_experience", "267"],
                                                          ["name", "charizard"],
                                                           ["weight", "905"]]);
      const expectedNumberOfResults: number = 20;

      const response = await request.get(`${baseUrl + charizardAPIrequest}`);
      expect(response.status()).toBe(goodResponse);

      const responseBody: any = await utility.convert_response_to_JSON(await response.text());
     
      await utility.check_json_response_matches_expected_result_in_arguments(responseBody,
                                                                              expectedNumberOfResults,
                                                                              expectedKeyValues
                                                                              ); 

    });

    test('Check the number of pokemons', async ({ request }) => {
      const allPokemonsAPIrequest: string = '/pokemon';
      const expectedKeyValues = new Map<string, string>([["count", "1302"]]);
      //this is the number elements returned in the JSON response rather than the
      //the number of pokemons
      const expectedNumberOfResults: number = 4;

      const response = await request.get(`${baseUrl + allPokemonsAPIrequest}`);
      expect(response.status()).toBe(goodResponse);

      const responseBody: any = await utility.convert_response_to_JSON(await response.text());

      await utility.check_json_response_matches_expected_result_in_arguments(responseBody,
                                                                              expectedNumberOfResults,
                                                                              expectedKeyValues
                                                                              ); 
    });

  });