"use strict";
/* jshint node: true */

module.exports = function (deployTarget) {
    var ENV = {
        //ember build --environment=production --output-path=../webapp/static/

        build: {
            outputPath: '../webapp/static'
        }
        // include other plugin configuration that applies to all deploy targets here
    };

    if (deployTarget === 'development') {
        ENV.build.environment = 'development';
        // configure other plugins for development deploy target here
    }

    if (deployTarget === 'staging') {
        ENV.build.environment = 'production';
        // configure other plugins for staging deploy target here
    }

    if (deployTarget === 'production') {
        ENV.build.environment = 'production';
        // configure other plugins for production deploy target here
    }

    //ENV.s3 = {
    //  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAI7BFK5TQ7S3PYQBQ',
    //  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
    //  bucket: 'dotfeedback-free',
    //  region: 'us-east-1'
    //};

    // ENV.slack = {
    //     webhookURL: 'https://hooks.slack.com/services/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',
    //     channel: '',
    //     iconURL: '',
    //
    //     willDeploy: function(context) {
    //         return function(slack) {
    //             return {
    //                 slackStartDeployDate: new Date()
    //             };
    //         };
    //     },
    //
    //     didDeploy: function(context) {
    //         return function(slack) {
    //             var start = context.slackStartDeployDate;
    //             var end = new Date();
    //             var duration = (end - start) / 1000;
    //
    //             return slack.notify({
    //                 text: 'Ember complication took '+duration+' seconds'
    //             });
    //         };
    //     }
    // };

    // Note: if you need to build some configuration asynchronously, you can return
    // a promise that resolves with the ENV object instead of returning the
    // ENV object synchronously.
    return ENV;
};
