import { expect } from 'chai';

import { BingSpeechClient, VoiceRecognitionResponse, VoiceSynthesisResponse } from './';

import * as nock from 'nock';

describe('Bing Speech API client', () => {
    it('should recognize a voice', () => {
        const mockResponse: VoiceRecognitionResponse = { 
            RecognitionStatus: 'Success',
            Offset: 9000000,
            Duration: 13400000,
            NBest: 
            [ { Confidence: 0.9616049528121948,
                Lexical: 'what\'s the weather look like today',
                ITN: 'What\'s the weather look like today',
                MaskedITN: 'What\'s the weather look like today',
                Display: 'What\'s the weather look like today?' },
            { Confidence: 0.9034169912338257,
                Lexical: 'how\'s the weather look like today',
                ITN: 'how\'s the weather look like today',
                MaskedITN: 'how\'s the weather look like today',
                Display: 'how\'s the weather look like today' },
            { Confidence: 0.9055131077766418,
                Lexical: 'how does the weather look like today',
                ITN: 'how does the weather look like today',
                MaskedITN: 'how does the weather look like today',
                Display: 'how does the weather look like today' } ] };

        nock('https://api.cognitive.microsoft.com')
            .post('/sts/v1.0/issueToken')
            .reply(200, 'FAKETOKEN');

        nock('https://speech.platform.bing.com')
            .post('/recognize')
            .query(true)
            .reply(200, mockResponse);

        let client = new BingSpeechClient('fakeSubscriptionId');

        let wave = new Buffer('');
        return client.recognize(wave)
            .then((response: VoiceRecognitionResponse) => {
                expect(response).to.eql(mockResponse);
            });
    });

    it('should synthesize a voice', () => {
         const mockResponse = 'this is a wav';

        nock('https://api.cognitive.microsoft.com')
            .post('/sts/v1.0/issueToken')
            .reply(200, 'FAKETOKEN');

        nock('https://speech.platform.bing.com')
            .post('/synthesize')
            .reply(200, mockResponse);

        let client = new BingSpeechClient('fakeSubscriptionId');

        return client.synthesize('This is a fake test')
            .then((response: VoiceSynthesisResponse) => {
                expect(response.wave.toString()).to.eq(mockResponse);
            });
    });
});
